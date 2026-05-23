import { useState, useRef, useEffect } from "react";

export default function Recorder({ onTranscriptReady }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef("");

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    transcriptRef.current = "";

    recognition.onresult = (event) => {
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + " ";
        }
      }
      transcriptRef.current = final;
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    if (transcriptRef.current.trim()) {
      onTranscriptReady(transcriptRef.current.trim());
    } else {
      alert("No speech detected. Please try again and speak clearly.");
    }
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const BARS = 10;

  return (
    <div className="recorder-card">
      <div className="recorder-top">
        <span className="recorder-label">Microphone</span>
        {isRecording && <span className="timer">{formatTime(seconds)}</span>}
      </div>

      <div className="waveform">
        {Array.from({ length: BARS }).map((_, i) => (
          <div
            key={i}
            className={`wave-bar ${isRecording ? "active" : ""}`}
            style={{ height: isRecording ? undefined : `${6 + Math.random() * 10}px` }}
          />
        ))}
      </div>

      <div className="recorder-controls">
        {!isRecording ? (
          <button className="btn-record" onClick={startRecording}>
            <span className="rec-dot" />
            Start Recording
          </button>
        ) : (
          <button className="btn-record recording" onClick={stopRecording}>
            <span className="rec-dot" />
            Stop Recording
          </button>
        )}
      </div>

      <div className="browser-note">
        ⚠ Uses your browser's microphone. Works best in Chrome.
      </div>
    </div>
  );
}
