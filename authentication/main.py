from api.routes_auth import auth_router
from core.auth_bearer import JWTBearer
from fastapi import FastAPI

jwt_bearer = JWTBearer()
app = FastAPI()
app.include_router(auth_router, prefix='/api/v1/auth', tags = ['Authentication'])
