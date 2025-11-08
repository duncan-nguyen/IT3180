from datetime import timedelta
from schemas.auth_schema import TokenRes, UserInfor
from core.security import authenticate_user, create_token, get_current_user, recreate_token
from fastapi import FastAPI, HTTPException, Depends, APIRouter, Body, Security
from fastapi.security import OAuth2PasswordRequestForm
from core.config import ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES
from core.auth_bearer import JWTBearer



jwt_bearer = JWTBearer()
auth_router = APIRouter(dependencies=[Security(jwt_bearer)])

@auth_router.post('/login', response_model = TokenRes)
def login_for_access_token(format_data: OAuth2PasswordRequestForm = Depends()) -> TokenRes:
    username = format_data.username
    password = format_data.password
    u = authenticate_user(username, password)
    if not u:
        raise HTTPException(status_code = 404, detail = "Incorrect username or password", headers = {"WWW-Authenticate": "Bearer"}) # thêm header để Swagger UI hiển thị đúng form
    access_token = create_token(u, 'access_token', timedelta(minutes = ACCESS_TOKEN_EXPIRES)) 
    refresh_token = create_token(u, 'refresh_token', timedelta(days= REFRESH_TOKEN_EXPIRES))
    return TokenRes(access_token = access_token,  refresh_token = refresh_token, token_type ='bearer')

@auth_router.get('/userinfor', response_model=UserInfor)
def get_user_infor(payload: UserInfor = Security(jwt_bearer)) -> UserInfor:
    return payload

@auth_router.post('/refresh', response_model=str)
def RC_token(refresh_token: str = Body(..., embed = True)):
        return recreate_token(refresh_token)
