from fastapi import FastAPI
from hokhau.hk_router import router

app = FastAPI(title="Service quản lí hộ khẩu")

app.include_router(router, prefix="/api/v1")

