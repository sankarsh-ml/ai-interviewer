import { useState } from "react";

import AtsScreeningPage from "./pages/AtsScreeningPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import StudentUploadPage from "./pages/StudentUploadPage.jsx";


function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [applicationSummary, setApplicationSummary] = useState(null);

  const handleUploadSuccess = (summary) => {
    setApplicationSummary(summary);
    setCurrentPage("ats");
  };

  const handleBackHome = () => {
    setApplicationSummary(null);
    setCurrentPage("home");
  };

  if (currentPage === "student") {
    return <StudentUploadPage onBack={handleBackHome} onUploadSuccess={handleUploadSuccess} />;
  }

  if (currentPage === "ats") {
    return (
      <AtsScreeningPage
        applicationSummary={applicationSummary}
        onBackHome={handleBackHome}
        onPassed={() => setCurrentPage("interview")}
      />
    );
  }

  if (currentPage === "interview") {
    return <InterviewPage onBackHome={handleBackHome} />;
  }

  return <HomePage onOpenStudent={() => setCurrentPage("student")} />;
}


export default App;
