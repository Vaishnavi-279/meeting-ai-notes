export default function Summary({ data }) {
  return (
    <div className="summary-card">
      <div className="summary-header">
        <div className="summary-title">{data.title}</div>
        <div className="summary-meta">AI Summary · just now</div>
      </div>
      <div className="summary-body">
        <div>
          <div className="section-title">Overview</div>
          <p className="summary-text">{data.overview}</p>
        </div>

        {data.keyPoints?.length > 0 && (
          <div>
            <div className="section-title">Key Points</div>
            <ul className="key-points">
              {data.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}

        {data.actionItems?.length > 0 && (
          <div>
            <div className="section-title">Action Items</div>
            <ul className="action-items">
              {data.actionItems.map((a, i) => (
                <li key={i} className="action-item">
                  <span className="action-num">0{i + 1}</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
