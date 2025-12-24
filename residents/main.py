from api.households_router import router as households_router
from api.residents_router import router as residents_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Service Quản lý Cư dân (Residents Service)")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(residents_router, prefix="/api/v1")
app.include_router(households_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "residents"}
