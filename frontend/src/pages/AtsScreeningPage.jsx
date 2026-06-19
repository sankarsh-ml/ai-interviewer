import { useEffect, useState } from "react";
import "../styles/AtsScreeningPage.css";

function AtsScreeningPage({
  applicationSummary,
  onBackHome,
  onPassed,
}) {
  const [loading, setLoading] = useState(true);
  const [atsResult, setAtsResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    runATS();
  }, []);

  const runATS = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/api/ats/score/${applicationSummary.application_id}`
      );

      const data = await response.json();

      if (data.success) {
        setAtsResult(data.result);
      } else {
        setError("ATS scoring failed");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to ATS service");
    } finally {
      setLoading(false);
    }
  };

  if (!applicationSummary) {
    return (
      <main className="ats-page">
        <section className="ats-panel">
          <h1>ATS Screening</h1>

          <p>No resume uploaded.</p>

          <button
            className="ats-home-button"
            onClick={onBackHome}
          >
            Back Home
          </button>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="ats-page">
        <section className="ats-panel">
          <h1>Running ATS Screening...</h1>
          <p>Please wait while we evaluate the resume.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ats-page">
        <section className="ats-panel">
          <h1>ATS Screening</h1>

          <p className="error-message">
            {error}
          </p>

          <button
            className="ats-home-button"
            onClick={onBackHome}
          >
            Back Home
          </button>
        </section>
      </main>
    );
  }

  const passed = atsResult.shortlisted;

  return (
    <main className="ats-page">
      <section className="ats-panel">

        <p className="eyebrow">
          Screening Pipeline
        </p>

        <h1>ATS Screening Result</h1>

        <div className="ats-summary-grid">

          <SummaryItem
            label="Candidate"
            value={atsResult.candidate_name}
          />

          <SummaryItem
            label="ATS Score"
            value={`${atsResult.final_score}%`}
          />

          <SummaryItem
            label="Matched Skills"
            value={atsResult.matched_skills.length}
          />

          <SummaryItem
            label="Missing Skills"
            value={atsResult.missing_skills.length}
          />

        </div>

        <div
          className={`result-banner ${
            passed ? "passed" : "failed"
          }`}
        >
          <h2>
            {passed
              ? "✅ ATS PASSED"
              : "❌ ATS FAILED"}
          </h2>

          <p>
            ATS Score:{" "}
            <strong>
              {atsResult.final_score}%
            </strong>
          </p>
        </div>

        <div className="skills-section">
          <h2>Matched Skills</h2>

          <div className="skill-list">
            {atsResult.matched_skills.length > 0 ? (
              atsResult.matched_skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-chip matched"
                >
                  {skill} <br></br>
                </span>
              ))
            ) : (
              <p>No matched skills</p>
            )}
          </div>
        </div>

        <div className="skills-section">
          <h2>Missing Skills</h2>

          <div className="skill-list">
            {atsResult.missing_skills.length > 0 ? (
              atsResult.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-chip missing"
                >
                  {skill}<br></br>
                </span>
              ))
            ) : (
              <p>No missing skills</p>
            )}
          </div>
        </div>

        <div className="decision-actions">
          {passed ? (
            <button
              className="decision-button passed"
              onClick={onPassed}
            >
              Continue to Interview
            </button>
          ) : (
            <button
              className="decision-button failed"
              onClick={onBackHome}
            >
              Back Home
            </button>
          )}
        </div>

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