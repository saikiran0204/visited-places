const Statistics = ({ locations }) => {
  const visitedCount = locations.filter(loc => loc.status === 'visited').length;
  const toVisitCount = locations.filter(loc => loc.status === 'to-visit').length;
  const reVisitCount = locations.filter(loc => loc.status === 're-visit').length;
  const totalCount = locations.length;
  const visitedPercentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  return (
    <div className="statistics-container">
      <h2>My Travel Stats</h2>
      <div className="stats-grid">
        <div className="stat-card visited">
          <div className="stat-number">{visitedCount}</div>
          <div className="stat-label">Visited</div>
        </div>
        <div className="stat-card to-visit">
          <div className="stat-number">{toVisitCount}</div>
          <div className="stat-label">To Visit</div>
        </div>
        <div className="stat-card re-visit">
          <div className="stat-number">{reVisitCount}</div>
          <div className="stat-label">Re-visit</div>
        </div>
        <div className="stat-card total">
          <div className="stat-number">{totalCount}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-label">
          Progress: {visitedPercentage}% completed
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${visitedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
