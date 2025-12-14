from fastapi import FastAPI
from nhankhau.nk_router import router

app = FastAPI(title="Service quản lí nhân khẩu")

app.include_router(router, prefix="/api/v1")

