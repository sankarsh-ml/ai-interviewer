import { useState } from "react";

import { submitAtsDecision } from "../api/resumeApi.js";
import "../styles/AtsScreeningPage.css";


function AtsScreeningPage({ applicationSummary, onBackHome, onPassed }) {
  const [error, setError] = useState("");
  const [loadingDecision, setLoadingDecision] = useState("");
  const [failed, setFailed] = useState(false);

  if (!applicationSummary) {
    return (
      <main className="ats-page">
        <section className="ats-panel">
          <h1>ATS Screening</h1>
          <p className="ats-message">No resume application is available.</p>
          <button className="ats-home-button" type="button" onClick={onBackHome}>
            Back Home
          </button>
        </section>
      </main>
    );
  }

  const handleDecision = async (decision) => {
    setError("");
    setLoadingDecision(decision);

    try {
      await submitAtsDecision(applicationSummary.application_id, decision);
      if (decision === "failed") {
        setFailed(true);
      } else {
        onPassed();
      }
    } catch (apiError) {
      setError(apiError.message || "Could not save ATS decision.");
    } finally {
      setLoadingDecision("");
    }
  };

  return (
    <main className="ats-page">
      <section className="ats-panel">
        <p className="eyebrow">Screening Pipeline</p>
        <h1>ATS Screening</h1>
        <p className="ats-message">Your resume has been submitted for ATS screening.</p>
        <p className="ats-note">Temporary manual ATS decision page for testing.</p>

        <div className="ats-summary-grid">
          <SummaryItem label="File name" value={applicationSummary.file_name} />
          <SummaryItem label="Total pages" value={applicationSummary.total_pages} />
          <SummaryItem label="Word count" value={applicationSummary.word_count} />
          <SummaryItem label="Text length" value={applicationSummary.text_length} />
        </div>

        {failed ? (
          <div className="rejection-box">
            <h2>ATS Failed</h2>
            <p>Sorry, your resume did not pass the ATS screening for this role.</p>
            <button className="ats-home-button" type="button" onClick={onBackHome}>
              Back Home
            </button>
          </div>
        ) : (
          <div className="decision-actions">
            <button
              className="decision-button passed"
              type="button"
              onClick={() => handleDecision("passed")}
              disabled={Boolean(loadingDecision)}
            >
              {loadingDecision === "passed" ? "Saving..." : "ATS Passed"}
            </button>
            <button
              className="decision-button failed"
              type="button"
              onClick={() => handleDecision("failed")}
              disabled={Boolean(loadingDecision)}
            >
              {loadingDecision === "failed" ? "Saving..." : "ATS Failed"}
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  );
}


function SummaryItem({ label, value }) {
  return (
    <article className="ats-summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}


export default AtsScreeningPage;
