import { useState, useRef, useEffect } from 'react';

const TagFilter = ({ locations, selectedTags, onTagsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract all unique tags from locations
  const allTags = [...new Set(locations.flatMap(loc => loc.tags || []))].sort();

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className="tag-filter-container" ref={dropdownRef}>
      <div className="tag-filter-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="tag-filter-label">
          {selectedTags.length === 0
            ? 'Filter by Tags'
            : `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`}
        </span>
        <span className="tag-filter-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="tag-filter-dropdown">
          <div className="tag-filter-actions">
            <button
              className="tag-clear-btn"
              onClick={handleClearAll}
              disabled={selectedTags.length === 0}
            >
              Clear All
            </button>
          </div>
          <div className="tag-filter-list">
            {allTags.map(tag => (
              <label key={tag} className="tag-filter-item">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                <span className="tag-label">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="selected-tags-display">
          {selectedTags.map(tag => (
            <span key={tag} className="selected-tag">
              {tag}
              <button
                className="remove-tag-btn"
                onClick={() => handleTagToggle(tag)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
