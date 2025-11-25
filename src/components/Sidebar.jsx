import { useState } from 'react';
import Statistics from './Statistics';
import Search from './Search';
import Filter from './Filter';
import TagFilter from './TagFilter';

const Sidebar = ({
  locations,
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  selectedLocation,
  onLocationSelect,
  onClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredLocations = locations.filter(location => {
    const statusMatch =
      (filters.showVisited && location.status === 'visited') ||
      (filters.showToVisit && location.status === 'to-visit') ||
      (filters.showReVisit && location.status === 're-visit');
    const searchMatch = searchTerm === '' ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Tag filtering: if tags are selected, location must have at least one matching tag
    const tagMatch = selectedTags.length === 0 ||
      (location.tags && location.tags.some(tag => selectedTags.includes(tag)));

    return statusMatch && searchMatch && tagMatch;
  });

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? '›' : '‹'}
        </button>

        {!isCollapsed && (
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h1>My Travel Map</h1>
              <p className="tagline">Track your adventures</p>
            </div>

            <Statistics locations={locations} />

            <div className="sidebar-controls">
              <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
              <Filter filters={filters} onFilterChange={onFilterChange} />
              <TagFilter
                locations={locations}
                selectedTags={selectedTags}
                onTagsChange={onTagsChange}
              />
            </div>

            <div className="locations-list">
              <h3 className="list-title">
                Locations ({filteredLocations.length})
              </h3>
              <div className="location-items">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                    onClick={() => onLocationSelect(location)}
                  >
                    <div className="location-item-header">
                      <span className={`location-status-dot ${location.status}`}></span>
                      <h4>{location.name}</h4>
                    </div>
                    <p className="location-item-description">{location.description}</p>
                    <div className="location-item-footer">
                      <span className="location-category">{location.category}</span>
                      {(location.visitDate || location.lastVisitDate) && (
                        <span className="location-date">
                          {new Date(location.visitDate || location.lastVisitDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="no-results">
                    <p>No locations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className={`location-detail-panel ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="detail-panel-header">
            <button className="close-detail" onClick={onClose}>×</button>
            <h2>{selectedLocation.name}</h2>
          </div>
          <div className="detail-panel-content">
            <div className={`detail-status ${selectedLocation.status}`}>
              {selectedLocation.status === 'visited' ? '✓ Visited' :
               selectedLocation.status === 're-visit' ? '↻ Re-visit' : '☆ To Visit'}
            </div>

            {selectedLocation.images && selectedLocation.images.length > 0 && (
              <div className="detail-section">
                <h3>Photos</h3>
                <div className="image-gallery">
                  {selectedLocation.images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`${selectedLocation.name} - Photo ${index + 1}`}
                      className="location-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>Description</h3>
              <p>{selectedLocation.description}</p>
            </div>

            <div className="detail-section">
              <h3>Category</h3>
              <p>{selectedLocation.category}</p>
            </div>

            {selectedLocation.location && (
              <div className="detail-section">
                <h3>Location</h3>
                <p>{selectedLocation.location}</p>
              </div>
            )}

            {(selectedLocation.visitDate || selectedLocation.lastVisitDate) && (
              <div className="detail-section">
                <h3>{selectedLocation.status === 're-visit' ? 'Last Visit Date' : 'Visit Date'}</h3>
                <p>{new Date(selectedLocation.visitDate || selectedLocation.lastVisitDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            )}

            {selectedLocation.notes && (
              <div className="detail-section">
                <h3>Notes</h3>
                <p>{selectedLocation.notes}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Coordinates</h3>
              <p>Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}</p>
            </div>

            <div className="detail-section">
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="google-maps-link"
              >
                <svg className="maps-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
