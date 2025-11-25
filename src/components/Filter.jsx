const Filter = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={filters.showVisited}
            onChange={(e) => onFilterChange('showVisited', e.target.checked)}
          />
          <span className="visited-marker">●</span> Show Visited
        </label>
        <label className="filter-label">
          <input
            type="checkbox"
            checked={filters.showToVisit}
            onChange={(e) => onFilterChange('showToVisit', e.target.checked)}
          />
          <span className="to-visit-marker">●</span> Show To Visit
        </label>
        <label className="filter-label">
          <input
            type="checkbox"
            checked={filters.showReVisit}
            onChange={(e) => onFilterChange('showReVisit', e.target.checked)}
          />
          <span className="re-visit-marker">●</span> Show Re-visit
        </label>
      </div>
    </div>
  );
};

export default Filter;
