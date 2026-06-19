import { useEffect, useRef, useState } from "react";

import "../styles/InterviewPage.css";


function InterviewPage({ onBackHome }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Camera permission failed:", error);
      setCameraError("Camera permission failed. Please allow camera and microphone access.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOn(false);
  };

  const handleBackHome = () => {
    stopCamera();
    onBackHome();
  };

  return (
    <main className="interview-page">
      <section className="interview-panel">
        <button className="back-button" type="button" onClick={handleBackHome}>
          Back Home
        </button>

        <header className="interview-header">
          <p className="eyebrow">Interview</p>
          <h1>Interview Session</h1>
          <p>Please keep your face visible and stay ready for the interview.</p>
        </header>

        <div className="video-frame">
          <video ref={videoRef} autoPlay playsInline muted />
          {!isCameraOn && <p className="video-placeholder">Camera preview will appear here.</p>}
        </div>

        <div className="camera-actions">
          <button className="camera-button start" type="button" onClick={startCamera} disabled={isCameraOn}>
            Start Camera
          </button>
          <button className="camera-button stop" type="button" onClick={stopCamera} disabled={!isCameraOn}>
            Stop Camera
          </button>
        </div>

        {cameraError && <p className="error-message">{cameraError}</p>}
      </section>
    </main>
  );
}


export default InterviewPage;
