import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import feedback, report

program = FastAPI(title="Service Quản lý Phản hồi (Feedback Service)")

# Shared HTTP client
http_client = None


@program.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    import logging
    logger = logging.getLogger(__name__)
    
    # Log detailed validation error
    logger.error(f"Validation error for {request.method} {request.url}")
    logger.error(f"Headers: {dict(request.headers)}")
    logger.error(f"Validation errors: {exc.errors()}")
    
    # Also print to stdout for docker logs
    print(f"[VALIDATION ERROR] {request.method} {request.url}")
    print(f"[VALIDATION ERROR] Headers: {dict(request.headers)}")
    print(f"[VALIDATION ERROR] Errors: {exc.errors()}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


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
