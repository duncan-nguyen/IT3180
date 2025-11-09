from datetime import timedelta
from typing import Annotated

from core.auth_bearer import JWTBearer
from core.config import ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES
from core.security import authenticate_user, create_token, recreate_token
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from schemas.auth_schema import AccessTokenResponse, TokenRes, UserInfor

jwt_bearer = JWTBearer()
auth_router = APIRouter()

@auth_router.post('/login', response_model = TokenRes, status_code=status.HTTP_200_OK)
async def login_for_access_token(format_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> TokenRes:
    username = format_data.username
    password = format_data.password
    u = authenticate_user(username, password)
    if not u:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Incorrect username or password", headers = {"WWW-Authenticate": "Bearer"}) # thêm header để Swagger UI hiển thị đúng form
    access_token = create_token(u, 'access_token', timedelta(minutes = ACCESS_TOKEN_EXPIRES)) 
    refresh_token = create_token(u, 'refresh_token', timedelta(days= REFRESH_TOKEN_EXPIRES))
    return TokenRes(access_token = access_token,  refresh_token = refresh_token, token_type ='bearer')

@auth_router.get('/userinfor', response_model=UserInfor, status_code=status.HTTP_200_OK)
async def get_user_infor(payload: UserInfor = Depends(jwt_bearer)) -> UserInfor:
    return payload

@auth_router.post('/refresh', response_model=AccessTokenResponse, status_code=status.HTTP_200_OK)
async def refresh_token(refresh_token: str = Body(..., embed = True)):
    try:
        new_access_token = recreate_token(refresh_token)
        return AccessTokenResponse(
            access_token=new_access_token,
            token_type='bearer'
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid refresh token: {str(e)}"
        )
