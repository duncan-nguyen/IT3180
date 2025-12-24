from fastapi import FastAPI
from app.routers import feedback, report

program = FastAPI(prefix="/api/v1")

program.include_router(feedback.router)
program.include_router(report.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(program, host="0.0.0.0", port=8000)