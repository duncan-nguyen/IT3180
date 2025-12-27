from api.routes_auth import auth_router
from api.routes_roles import roles_router
from api.routes_logs import logs_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api/v1", tags=["Authentication"])
app.include_router(roles_router, prefix="/api/v1", tags=["Roles"])
app.include_router(logs_router, prefix="/api/v1", tags=["Audit Logs"])
