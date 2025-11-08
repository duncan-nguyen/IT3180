from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request, HTTPException
from core.security import get_current_user
from schemas.auth_schema import UserInfor

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error = auto_error)
        
    async def __call__(self, request: Request)->UserInfor:
        credentials : HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        if credentials.scheme != 'Bearer': 
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        token = credentials.credentials
        payload = get_current_user(token)
        return payload      