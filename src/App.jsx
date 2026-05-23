import { useState, useRef, useEffect } from "react";
import Recorder from "./components/Recorder";
import Transcript from "./components/Transcript";
import Summary from "./components/Summary";
import NotesList from "./components/NotesList";
import { summarizeTranscript } from "./utils/groq";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("record"); // record | notes
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("meeting_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("groq_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleTranscriptReady = async (text) => {
    setTranscript(text);
    setSummary(null);
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) return;
    if (!apiKey) { setShowKeyInput(true); return; }
    setIsProcessing(true);
    try {
      const result = await summarizeTranscript(transcript, apiKey);
      setSummary(result);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setIsProcessing(false);
  };

  const handleSave = () => {
    if (!transcript && !summary) return;
    const note = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      transcript,
      summary,
      title: summary?.title || "Untitled Meeting",
    };
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem("meeting_notes", JSON.stringify(updated));
    setTranscript("");
    setSummary(null);
    setTab("notes");
  };

  const handleDeleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("meeting_notes", JSON.stringify(updated));
  };

  const saveKey = (k) => {
    localStorage.setItem("groq_api_key", k);
    setApiKey(k);
    setShowKeyInput(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◉</span>
            <span className="logo-text">NoteAI</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${tab === "record" ? "active" : ""}`} onClick={() => setTab("record")}>
              Record
            </button>
            <button className={`nav-btn ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>
              Notes {notes.length > 0 && <span className="badge">{notes.length}</span>}
            </button>
          </nav>
          <button className="key-btn" onClick={() => setShowKeyInput(true)} title="Set API Key">
            {apiKey ? "🔑" : "⚠️ Set Key"}
          </button>
        </div>
      </header>

      {showKeyInput && (
        <KeyModal currentKey={apiKey} onSave={saveKey} onClose={() => setShowKeyInput(false)} />
      )}

      <main className="main">
        {tab === "record" && (
          <div className="record-view">
            <div className="hero">
              <h1>Record. Transcribe. <em>Understand.</em></h1>
              <p>Capture any meeting or lecture and get instant AI-powered notes.</p>
            </div>

            <Recorder onTranscriptReady={handleTranscriptReady} />

            {transcript && (
              <>
                <Transcript text={transcript} onChange={setTranscript} />
                <div className="action-row">
                  <button className="btn-primary" onClick={handleSummarize} disabled={isProcessing}>
                    {isProcessing ? <><span className="spinner" /> Summarizing...</> : "✦ Summarize with AI"}
                  </button>
                </div>
              </>
            )}

            {summary && (
              <>
                <Summary data={summary} />
                <div className="action-row">
                  <button className="btn-save" onClick={handleSave}>💾 Save Note</button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "notes" && (
          <NotesList notes={notes} onDelete={handleDeleteNote} />
        )}
      </main>
    </div>
  );
}

function KeyModal({ currentKey, onSave, onClose }) {
  const [val, setVal] = useState(currentKey);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Groq API Key</h3>
        <p>Get your free key at <a href="https://console.groq.com" target="_blank">console.groq.com</a></p>
        <input
          className="key-input"
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="gsk_..."
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => onSave(val)}>Save</button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
