import { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, PlaceCard, PlaceCardSkeletonGrid, LoadingSpinner } from '../components/index';
import { fetchPlaces, searchPlaces } from '../api/placesAPI';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Fetch places on mount
  useEffect(() => {
    loadPlaces();
  }, []);

  // Handle search
  useEffect(() => {
    handleSearch();
  }, [searchQuery, sortBy, places]);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlaces();
      setPlaces(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load places');
      console.error('Error loading places:', err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      applySorting(places);
      return;
    }

    try {
      const results = await searchPlaces(searchQuery);
      applySorting(results || []);
    } catch (err) {
      console.error('Search error:', err);
      applySorting(places);
    }
  }, [searchQuery, places]);

  const applySorting = (data) => {
    let sorted = [...data];

    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.core?.rating || 0) - (a.core?.rating || 0));
        break;
      case 'reviews':
        sorted.sort((a, b) => (b.core?.userRatingCount || 0) - (a.core?.userRatingCount || 0));
        break;
      case 'name':
      default:
        sorted.sort((a, b) =>
          (a.core?.name || '').localeCompare(b.core?.name || '')
        );
        break;
    }

    setFilteredPlaces(sorted);
  };

  const handleRefresh = () => {
    loadPlaces();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Places</h1>
          <p className="text-gray-600 mt-1">Manage and explore all locations</p>
        </div>
        <Button variant="primary" onClick={handleRefresh} icon="🔄">
          Refresh
        </Button>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search places by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="🔍"
            />

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="reviews">Reviews (Most)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredPlaces.length}</span> of{' '}
              <span className="font-semibold">{places.length}</span> places
            </div>
          )}
        </div>
      </Card>

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading places</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <Button variant="primary" size="sm" onClick={handleRefresh} className="mt-3">
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && <PlaceCardSkeletonGrid count={12} />}

      {/* Empty State */}
      {!loading && filteredPlaces.length === 0 && !error && (
        <Card>
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📍</p>
            <h3 className="text-lg font-semibold text-gray-800">No places found</h3>
            <p className="text-gray-600 mt-2">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'No places available at this time'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Places Grid */}
      {!loading && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place._id || place.google_place_id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
