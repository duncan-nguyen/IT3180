from api.routes_auth import auth_router
from fastapi import FastAPI
# from database.supabase_client import supabase_client

app = FastAPI()
app.include_router(auth_router, prefix='/api/v1/auth', tags = ['Authentication'])


