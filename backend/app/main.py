from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.job_routes import router as job_router
from app.routes.ats_routes import router as ats_router
from app.routes.resume_routes import router as resume_router


app = FastAPI(title="Resume Text Extraction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(ats_router, prefix="/api/ats", tags=["ATS"])
app.include_router(job_router, prefix="/api/hr", tags=["HR"])

@app.get("/")
def root():
    return {
        "success": True,
        "message": "Resume Text Extraction API is running",
    }
