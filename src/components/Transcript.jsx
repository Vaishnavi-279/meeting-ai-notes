export default function Transcript({ text, onChange }) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="transcript-card">
      <div className="card-header">
        <span className="card-label">Transcript</span>
        <span className="word-count">{wordCount} words</span>
      </div>
      <textarea
        className="transcript-textarea"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcript will appear here. You can edit it before summarizing."
        rows={6}
      />
    </div>
  );
}
