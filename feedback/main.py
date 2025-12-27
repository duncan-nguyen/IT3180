import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import feedback, report

program = FastAPI(title="Service Quản lý Phản hồi (Feedback Service)")

# Shared HTTP client
http_client = None


@program.on_event("startup")
async def startup_event():
    global http_client
    http_client = httpx.AsyncClient()


@program.on_event("shutdown")
async def shutdown_event():
    global http_client
    if http_client:
        await http_client.aclose()


# Add CORS middleware
program.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

program.include_router(feedback.router, prefix="/api/v1")
program.include_router(report.router, prefix="/api/v1")


@program.get("/health")
async def health_check():
    return {"status": "ok", "service": "feedback"}


@program.get("/test-auth")
async def test_auth():
    import httpx

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://authentication:8000/api/v1/validate",
                json={"username": "admin", "access_token": "test"},
            )
            return {
                "status": "success",
                "status_code": response.status_code,
                "response": response.text,
            }
    except Exception as e:
        return {"status": "error", "error": str(e), "type": type(e).__name__}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(program, host="0.0.0.0", port=8000)
