import { useState, useMemo } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import visitedLocationsData from './data/visited-locations.json';
import toVisitLocationsData from './data/to-visit-locations.json';
import reVisitLocationsData from './data/re-visit-locations.json';
import './App.css';

function App() {
  // Combine all location arrays
  const locationsData = useMemo(() => {
    return [...visitedLocationsData, ...toVisitLocationsData, ...reVisitLocationsData];
  }, []);

  const [filters, setFilters] = useState({
    showVisited: true,
    showToVisit: true,
    showReVisit: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const filteredLocations = useMemo(() => {
    return locationsData.filter(location => {
      // Filter by status
      const statusMatch =
        (filters.showVisited && location.status === 'visited') ||
        (filters.showToVisit && location.status === 'to-visit') ||
        (filters.showReVisit && location.status === 're-visit');

      // Filter by search term
      const searchMatch = searchTerm === '' ||
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by tags
      const tagMatch = selectedTags.length === 0 ||
        (location.tags && location.tags.some(tag => selectedTags.includes(tag)));

      return statusMatch && searchMatch && tagMatch;
    });
  }, [locationsData, filters, searchTerm, selectedTags]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="app-container">
      <Sidebar
        locations={locationsData}
        filters={filters}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        onClose={handleCloseDetail}
      />
      <div className="map-wrapper">
        <Map
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
}

export default App;
