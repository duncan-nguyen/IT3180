from fastapi import FastAPI, Security
from api.routes_auth import auth_router
from core.auth_bearer import JWTBearer     


jwt_bearer = JWTBearer()
app = FastAPI(dependencies=[Security(jwt_bearer)])
app.include_router(auth_router, prefix='/api/v1/auth', tags = ['Authentication'])
