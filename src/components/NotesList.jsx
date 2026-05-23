import { useState } from "react";

export default function NotesList({ notes, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  if (notes.length === 0) {
    return (
      <div className="notes-view">
        <div className="notes-header">
          <h2>Your Notes</h2>
          <p>Saved meetings and lectures will appear here.</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">◉</div>
          <p>No notes yet. Record your first meeting!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-view">
      <div className="notes-header">
        <h2>Your Notes</h2>
        <p>{notes.length} saved {notes.length === 1 ? "note" : "notes"}</p>
      </div>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card" onClick={() => setExpanded(expanded === note.id ? null : note.id)}>
            <div className="note-card-header">
              <div className="note-title">{note.title}</div>
              <div className="note-date">{note.date}</div>
            </div>
            <p className="note-preview">
              {note.summary?.overview || note.transcript}
            </p>
            <div className="note-footer">
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {expanded === note.id ? "▲ Collapse" : "▼ Expand"}
              </span>
              <div className="note-actions">
                <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
                  Delete
                </button>
              </div>
            </div>

            {expanded === note.id && (
              <div className="note-expanded" onClick={(e) => e.stopPropagation()}>
                {note.summary && (
                  <>
                    {note.summary.keyPoints?.length > 0 && (
                      <>
                        <div className="note-section-title">Key Points</div>
                        {note.summary.keyPoints.map((p, i) => (
                          <p key={i} className="note-text">◆ {p}</p>
                        ))}
                      </>
                    )}
                    {note.summary.actionItems?.length > 0 && (
                      <>
                        <div className="note-section-title">Action Items</div>
                        {note.summary.actionItems.map((a, i) => (
                          <p key={i} className="note-text">0{i+1}. {a}</p>
                        ))}
                      </>
                    )}
                  </>
                )}
                <div className="note-section-title">Full Transcript</div>
                <p className="note-text">{note.transcript}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
