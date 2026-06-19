from pathlib import Path
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi import Form
from app.services.db_service import  save_resume_application
from app.services.resume_parser import (
    clean_text,
    extract_sections,
    extract_text_from_pdf,
)


router = APIRouter()

APP_DIR = Path(__file__).resolve().parents[1]
RESUME_STORAGE_DIR = APP_DIR / "storage" / "resumes"


async def _process_resume_upload(file: UploadFile):
    original_file_name = Path(file.filename or "").name

    if not original_file_name.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    RESUME_STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    saved_file_name = f"{uuid.uuid4()}_{original_file_name}"
    saved_file_path = RESUME_STORAGE_DIR / saved_file_name

    file_content = await file.read()
    saved_file_path.write_bytes(file_content)

    try:
        extracted = extract_text_from_pdf(str(saved_file_path))
    except Exception as exc:
        saved_file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Unable to read the PDF file") from exc

    extracted_text = clean_text(extracted["text"])
    sections_detected = extract_sections(extracted_text)

    return {
        "file_name": original_file_name,
        "saved_file_name": saved_file_name,
        "file_path": str(saved_file_path),
        "file_type": "pdf",
        "total_pages": extracted["total_pages"],
        "text_length": len(extracted_text),
        "word_count": len(extracted_text.split()),
        "extracted_text": extracted_text,
        "ats_ready_data": {
            "raw_text": extracted_text,
            "normalized_text": extracted_text,
            "sections_detected": sections_detected,
        },
    }

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...),job_id: str = Form(...)):
    resume_data = await _process_resume_upload(file)

    application_id = save_resume_application(
    {
        **resume_data,
        "job_id": job_id,
        "ats_status": "pending",
    })

    return {
        "success": True,
        "message": "Resume uploaded and stored successfully",
        "data": {
            "application_id": application_id,
            "file_name": resume_data["file_name"],
            "file_type": resume_data["file_type"],
            "total_pages": resume_data["total_pages"],
            "text_length": resume_data["text_length"],
            "word_count": resume_data["word_count"],
            "ats_status": "pending",
            "next_step": "ats_screening",
        },
    }

@router.post("/extract-text")
async def extract_resume_text(file: UploadFile = File(...)):
    resume_data = await _process_resume_upload(file)

    return {
        "success": True,
        "message": "Resume text extracted successfully",
        "data": {
            "file_name": resume_data["file_name"],
            "saved_file_name": resume_data["saved_file_name"],
            "file_type": resume_data["file_type"],
            "total_pages": resume_data["total_pages"],
            "text_length": resume_data["text_length"],
            "word_count": resume_data["word_count"],
            "extracted_text": resume_data["extracted_text"],
            "ats_ready_data": resume_data["ats_ready_data"],
        },
    }
