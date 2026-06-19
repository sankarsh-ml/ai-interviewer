from fastapi import APIRouter, HTTPException

from app.services.db_service import (
    get_application_by_id,
    get_job_by_id,
)

from app.services.ats_engine import calculate_ats

router = APIRouter()


@router.get("/score/{application_id}")
def score_resume(application_id: str):

    application = get_application_by_id(
        application_id
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    job = get_job_by_id(
        application["job_id"]
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    sections = (
        application["ats_ready_data"]
        ["sections_detected"]
    )

    resume_data = {
        "data": {

            "candidate_name":
                application["file_name"],

            "skills":
                sections["skills"]["items"],

            "education":
                sections["education"]["items"],

            "projects":
                sections["projects"]["items"],

            "experience":
                sections["experience"]["items"],
        }
    }

    result = calculate_ats(
        resume_data,
        job
    )

    return {
        "success": True,
        "result": result,
    }