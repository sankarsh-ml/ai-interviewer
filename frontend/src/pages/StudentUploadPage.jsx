import { useState } from "react";

import { uploadResume } from "../api/resumeApi.js";
import "../styles/StudentUploadPage.css";


function StudentUploadPage({ onBack, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!file) {
      setError("Please select a PDF resume before uploading.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await uploadResume(file);
      onUploadSuccess(response.data);
    } catch (apiError) {
      setError(apiError.message || "Could not upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <section className="upload-container">
        <button className="back-button" type="button" onClick={onBack}>
          Back
        </button>

        <header className="upload-header">
          <p className="eyebrow">Student</p>
          <h1>Upload Resume</h1>
          <p className="upload-subtitle">
            Your resume will be parsed and stored for ATS screening.
          </p>
        </header>

        <section className="upload-panel">
          <label className="file-input-label" htmlFor="resume-file">
            <span>{file ? file.name : "Select a PDF resume"}</span>
            <input id="resume-file" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} />
          </label>

          <button className="upload-button" type="button" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </section>

        {error && <p className="error-message">{error}</p>}

        {!loading && (
          <p className="empty-message">
            No resume uploaded yet. After upload, you will continue to ATS screening.
          </p>
        )}
      </section>
    </main>
  );
}


export default StudentUploadPage;
