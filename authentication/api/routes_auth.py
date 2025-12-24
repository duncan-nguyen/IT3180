from datetime import timedelta
from typing import Annotated
import uvicorn
from core.utils import hash_pw
from core.auth_bearer import JWTBearer, JWTBearerMe, InternalServiceAuth
from core.config import ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES
from core.security import authenticate_user, create_token, recreate_token, get_current_user, save_audit_log
from fastapi import APIRouter, Body, Depends, HTTPException, status, BackgroundTasks
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from schemas.auth_schema import UserCreateForm, UserInfor, LoginRes,UserUpdateForm, UserRole, ResetPasswordForm, AccessTokenResponse, RefreshTokenRequest, AuditLogForm, AuthRes
from database.supabase_client import supabase_client


auth_router = APIRouter()

@auth_router.post('/validate', response_model = AuthRes, status_code = 200)
def auth_check(user : UserInfor = Depends(JWTBearerMe())):
    return AuthRes(
        role = user.role,
        id = user.id,
        scope_id = user.scope_id  
    )


def exist_user_checking(id: str):
    data = supabase_client.table('users').select('id').eq('id', id).execute()
    if not data.data:
        raise HTTPException(status_code = 404, detail = 'ID Not Found')

    
    
    
@auth_router.post('/login', response_model = LoginRes, status_code=status.HTTP_200_OK) 
def login_for_access_token(format_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        username = format_data.username
        password = format_data.password
        id = authenticate_user(username, password)
        if not id:
            raise HTTPException(status_code = 400, detail = "Incorrect username or password", headers = {"WWW-Authenticate": "Bearer"}) # thêm header để Swagger UI hiển thị đúng form
        access_token = create_token(id, 'access_token', timedelta(minutes = ACCESS_TOKEN_EXPIRES)) 
        refresh_token = create_token(id, 'refresh_token', timedelta(days= REFRESH_TOKEN_EXPIRES))
        res = supabase_client.table('users').select('*').eq('id', id).execute()
        data = res.data[0]
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Incorrect username or password", headers = {"WWW-Authenticate": "Bearer"}) 


    user_data: UserInfor = {
                    'id': data['id'],
                    'username': data['username'],
                    'role': data['role'],
                    'scope_id': data['scope_id'] ,
                    'active': data['active']
                }
    return LoginRes(access_token = access_token,  refresh_token = refresh_token, token_type ='bearer', user = user_data) #bo


    
@auth_router.get('/me', response_model = UserInfor, status_code=status.HTTP_200_OK)
def get_me(user_data: UserInfor = Depends(JWTBearerMe())):
    try:
        return user_data
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    

@auth_router.get('/users', response_model = list[UserInfor], status_code = 200)
def get_users(user_data: UserInfor = Depends(JWTBearer([UserRole.ADMIN]))):
    try:
        res = supabase_client.table('users').select('*').execute()
        db = res.data
        li: list[UserInfor] = []
        for u in db:
            li.append(UserInfor(
                id = u['id'],
                username = u['username'],
                role = u['role'],
                active = bool(u['active']),
                scope_id = str(u['scope_id']) 
            ))
        return li
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    
@auth_router.post('/users', status_code = 200)
def create_user(user: UserCreateForm = Body(..., embed = True), user_data: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN))):
    data = supabase_client.table('users').select('id', count = 'exact').eq('username', user.username).execute()
    if data.count > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    try:
        supabase_client.table('users').insert({
            'username':user.username,
            'role': user.role.value,
            'scope_id': user.scope_id,
            'password_hash' : hash_pw(user.password),
            'active': True
        }).execute()
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    return {"message": "Successfully Created"}

@auth_router.post('/users/{id}', status_code = 200)
def update_user(id: str, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN])), update_data: UserUpdateForm = Body(..., embed = True)):
    exist_user_checking(id)
    try:
        update_fields = {k:v if k != "role" else v.value for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
        if not update_fields:
            raise HTTPException(status_code = 400, detail = 'Invalid Update Form')
        supabase_client.table('users').update(update_fields).eq('id', id).execute()
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    return {"message": "Successfully Updated"}

@auth_router.post('/{id}/reset-password')
def reset_password(id : str, password : ResetPasswordForm = Body(..., embed = True), user: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN]))):
    exist_user_checking(id)
    try:
        supabase_client.table('users').update({'password_hash': hash_pw(password.password)})
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    return {"message": "Successfully Updated"}


#bonus
@auth_router.post('/refresh', status_code=status.HTTP_200_OK)
def refresh_token(refresh_token: RefreshTokenRequest = Body(..., embed = True)):
    try:
        new_access_token = recreate_token(refresh_token.refresh_token)
        return AccessTokenResponse(
            access_token=new_access_token,
            token_type='bearer'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid refresh token: {str(e)}")
        

@auth_router.delete('/users/{id}/delete', status_code = 200)
def delete_user(id: str, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value]))):
    exist_user_checking(id)
    try: 
        supabase_client.table('users').delete().eq('id', id).execute()
        return {'message' : 'Successfully Deleted'}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    
    
    
@auth_router.post('/users/{id}/lock', status_code = 200)
def lock_user(id: str, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value]))):
    exist_user_checking(id)
    try:
        supabase_client.table('users').update({'active': False}).eq('id', id).execute()
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    return {'message': 'Successfully Locked'}



@auth_router.put('/users/{id}/unlock', status_code = 200)
def unlock_user(id: str, background_task: BackgroundTasks, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value]))):
    exist_user_checking(id)
    try:
        before_data = supabase_client.table('users').select('*').eq('id', id).execute().data[0]
        supabase_client.table('users').update({'active': True}).eq('id', id).execute()
        after_data = supabase_client.table('users').select('*').eq('id', id).execute().data[0]
        t = AuditLogForm(
            user_id = user_data.id,
            action = "UNLOCK_USER",
            entity_name = "USER",
            entity_id = id,
            before_state = before_data,
            after_state = after_data
        )
        background_task.add_task(save_audit_log, t)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"{str(e)}")
    return {'message': 'Successfully Unlocked'}

@auth_router.post("/internal/audit-logs", status_code=200)
async def create_audit_log_api(data: AuditLogForm, _: UserInfor = Depends(InternalServiceAuth())):
    print(data)
    await save_audit_log(data)


