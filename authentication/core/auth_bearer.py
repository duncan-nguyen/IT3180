from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request, HTTPException, Path
from core.security import get_current_user
from schemas.auth_schema import UserInfor, UserRole
from core.config import INTERNAL_API_KEY

class JWTBearer(HTTPBearer):    
    def __init__(self, accepted_role_list: list[UserRole], accepted_scope_list: list[str] | None = None, auto_error: bool = True):
        super().__init__( auto_error = auto_error) 
        self.accepted_role_list = accepted_role_list
        self.accepted_scope_list = accepted_scope_list
        
    async def __call__(self, request: Request)->UserInfor:
        target_user_id = request.path_params.get("id")
        credentials : HTTPAuthorizationCredentials = await super().__call__(request) 
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        if credentials.scheme != 'Bearer': 
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        token = credentials.credentials
        user_data = await get_current_user(token) 
        if(
            user_data is not None and
            hasattr(user_data, 'active') and
            hasattr(user_data, "role") and
            hasattr(user_data, "id") and 
            hasattr(user_data, 'scope_id')
        ):  
            if(not user_data.active):
                raise HTTPException(status_code = 403, detail = "Locked User")
            if user_data.role in self.accepted_role_list:
                return user_data    
        else: raise HTTPException(status_code = 401, detail = "Invalid User")
    
    
        
class JWTBearerMe(HTTPBearer):    
    def __init__(self, auto_error: bool = True): 
        super().__init__( auto_error = auto_error) 

        
    async def __call__(self, request: Request) ->UserInfor:
        try:
            credentials : HTTPAuthorizationCredentials = await super().__call__(request) 
            if not credentials:
                raise HTTPException(status_code=403, detail="Invalid authorization code")
            if credentials.scheme != 'Bearer': 
                raise HTTPException(status_code=401, detail="Invalid auth scheme")
            token = credentials.credentials
            user_data: UserInfor = await get_current_user(token)
            return user_data
        except HTTPException as e:
            raise HTTPException(status_code = 500, detail = f'{str(e)}')
        
    

class InternalServiceAuth:
    def __call__(self, request: Request):
        key = request.headers.get("X-Internal-Key")

        if key != INTERNAL_API_KEY:
            raise HTTPException(status_code=403, detail="Forbidden")