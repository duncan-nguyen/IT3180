from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, feedback, households, logs, residents, roles, statistics

# redirect_slashes=False prevents 307 redirects for POST/PUT/DELETE requests
# when trailing slash is missing (e.g., /households vs /households/)
app = FastAPI(title="Citizen Management API", redirect_slashes=False)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(roles.router, prefix="/api/v1", tags=["Roles"])
app.include_router(logs.router, prefix="/api/v1", tags=["Audit Logs"])

# Residents routes
app.include_router(households.router, prefix="/api/v1", tags=["Households"])
app.include_router(residents.router, prefix="/api/v1", tags=["Residents"])

# Feedback routes
app.include_router(feedback.router, prefix="/api/v1", tags=["Feedback"])

# Statistics routes
app.include_router(statistics.router, prefix="/api/v1", tags=["Statistics"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "citizen-management"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
