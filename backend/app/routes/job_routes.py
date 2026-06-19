from fastapi import APIRouter
from pydantic import BaseModel

from app.services.db_service import (
    save_job,
    get_all_jobs,
)

router = APIRouter()


class JobRequest(BaseModel):
    title: str
    required_skills: list[str]
    education: str
    experience: int
    keywords: list[str]


@router.post("/jobs")
def create_job(job: JobRequest):

    job_id = save_job(
        {
            "title": job.title,
            "required_skills": job.required_skills,
            "education": job.education,
            "experience": job.experience,
            "keywords": job.keywords,
        }
    )

    return {
        "success": True,
        "job_id": job_id,
        "message": "Job created successfully",
    }


@router.get("/jobs")
def fetch_jobs():

    return {
        "success": True,
        "jobs": get_all_jobs(),
    }