import { useEffect, useState } from "react";

import { uploadResume } from "../api/resumeApi.js";
import "../styles/StudentUploadPage.css";

function StudentUploadPage({ onBack, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/hr/jobs"
      );

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setError("Please choose a PDF resume.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!selectedJob) {
      setError("Please select a job first.");
      return;
    }

    if (!file) {
      setError("Please select a PDF resume before uploading.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await uploadResume(
        file,
        selectedJob
      );

      onUploadSuccess(response.data);

    } catch (apiError) {

      setError(
        apiError.message ||
        "Could not upload resume."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <section className="upload-container">

        <button
          className="back-button"
          type="button"
          onClick={onBack}
        >
          Back
        </button>

        <header className="upload-header">
          <p className="eyebrow">Student</p>

          <h1>Upload Resume</h1>

          <p className="upload-subtitle">
            Select a job and upload your resume for ATS screening.
          </p>
        </header>

        {/* JOB SELECTION */}

        <section className="result-block">
          <h2>Available Jobs</h2>

          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            jobs.map((job) => (
              <label
                key={job.id}
                style={{
                  display: "block",
                  marginBottom: "12px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="job"
                  value={job.id}
                  checked={selectedJob === job.id}
                  onChange={() =>
                    setSelectedJob(job.id)
                  }
                />

                <strong
                  style={{
                    marginLeft: "8px",
                  }}
                >
                  {job.title}
                </strong>

                <p
                  style={{
                    marginLeft: "25px",
                    marginTop: "4px",
                    color: "#64748b",
                  }}
                >
                  {job.description}
                </p>
              </label>
            ))
          )}
        </section>

        {/* UPLOAD */}

        <section className="upload-panel">
          <label
            className="file-input-label"
            htmlFor="resume-file"
          >
            <span>
              {file
                ? file.name
                : "Select a PDF resume"}
            </span>

            <input
              id="resume-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
          </label>

          <button
            className="upload-button"
            type="button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload"}
          </button>
        </section>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading && (
          <p className="empty-message">
            After upload, ATS screening will begin.
          </p>
        )}

      </section>
    </main>
  );
}

export default StudentUploadPage;