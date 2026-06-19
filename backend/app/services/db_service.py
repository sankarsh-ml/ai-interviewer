import json
import uuid
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"

JOBS_FILE = DATA_DIR / "jobs.json"
APPLICATIONS_FILE = DATA_DIR / "applications.json"


def _load_json(file_path):
    if not file_path.exists():
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_json(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# -------------------------
# JOBS
# -------------------------

def save_job(job_data: dict):

    jobs = _load_json(JOBS_FILE)

    job = {
        "id": str(uuid.uuid4()),
        **job_data,
    }

    jobs.append(job)

    _save_json(JOBS_FILE, jobs)

    return job["id"]


def get_all_jobs():

    return _load_json(JOBS_FILE)


# -------------------------
# APPLICATIONS
# -------------------------

def save_resume_application(data: dict):

    applications = _load_json(APPLICATIONS_FILE)

    application = {
        "application_id": str(uuid.uuid4()),
        **data,
    }

    applications.append(application)

    _save_json(APPLICATIONS_FILE, applications)

    return application["application_id"]
def get_job_by_id(job_id: str):

    jobs = _load_json(JOBS_FILE)

    for job in jobs:
        if job["id"] == job_id:
            return job

    return None

def get_application_by_id(application_id: str):

    applications = _load_json(APPLICATIONS_FILE)

    for application in applications:
        if application["application_id"] == application_id:
            return application

    return None