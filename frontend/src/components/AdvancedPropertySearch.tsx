import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationSuggestion {
  type: 'city' | 'area' | 'neighborhood' | 'address';
  value: string;
  label: string;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
  };
  createdAt: string;
}

const AdvancedPropertySearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '');
  const [features, setFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  
  // Autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  
  // Saved searches state
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Load saved searches for authenticated users
  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  // Location autocomplete
  useEffect(() => {
    if (location.length >= 2 && locationInputFocused) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/properties/locations/suggestions?query=${encodeURIComponent(location)}`);
          if (response.ok) {
            const suggestions = await response.json();
            setLocationSuggestions(suggestions);
            setShowLocationSuggestions(true);
          }
        } catch (error) {
          console.error('Failed to fetch location suggestions:', error);
        }
      }, 300);
    } else {
      setShowLocationSuggestions(false);
      setLocationSuggestions([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [location, locationInputFocused]);

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/properties/searches/saved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const searches = await response.json();
        setSavedSearches(searches);
      }
    } catch (error) {
      console.error('Failed to fetch saved searches:', error);
    }
  };

  const saveCurrentSearch = async () => {
    if (!user || !saveSearchName.trim()) return;

    const currentFilters = {
      propertyType: propertyType !== 'all' ? propertyType : undefined,
      location: location || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      features: features.length > 0 ? features : undefined,
      sort: sortBy
    };

    try {
      const response = await fetch('/api/properties/searches/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          searchQuery,
          filters: currentFilters,
          name: saveSearchName.trim()
        })
      });

      if (response.ok) {
        setSaveSearchName('');
        setShowSaveDialog(false);
        fetchSavedSearches();
        alert('Search saved successfully!');
      } else {
        alert('Failed to save search');
      }
    } catch (error) {
      console.error('Failed to save search:', error);
      alert('Failed to save search');
    }
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query || '');
    setLocation(savedSearch.filters.location || '');
    setPropertyType(savedSearch.filters.propertyType || 'all');
    setMinPrice(savedSearch.filters.minPrice?.toString() || '');
    setMaxPrice(savedSearch.filters.maxPrice?.toString() || '');
    setBedrooms(savedSearch.filters.bedrooms?.toString() || '');
    setBathrooms(savedSearch.filters.bathrooms?.toString() || '');
    setFeatures(savedSearch.filters.features || []);
    setSortBy((savedSearch.filters as any).sort || '-createdAt');
    setShowSavedSearches(false);
    
    // Trigger search with loaded parameters
    handleSearch();
  };

  const deleteSavedSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/properties/searches/${searchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchSavedSearches();
      }
    } catch (error) {
      console.error('Failed to delete saved search:', error);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.value);
    setShowLocationSuggestions(false);
    locationInputRef.current?.blur();
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('location', location);
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (features.length > 0) params.set('features', features.join(','));
    if (sortBy !== '-createdAt') params.set('sort', sortBy);
    
    navigate(`/properties/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPropertyType('all');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setFeatures([]);
    setSortBy('-createdAt');
  };

  const availableFeatures = [
    'furnished', 'parking', 'garden', 'balcony', 'gym', 'pool', 
    'security', 'elevator', 'air_conditioning', 'wifi', 'laundry', 'pet_friendly'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Property</h2>
        {user && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Saved Searches ({savedSearches.length})
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Search
            </button>
          </div>
        )}
      </div>

      {/* Saved Searches Dropdown */}
      {showSavedSearches && savedSearches.length > 0 && (
        <div className="mb-4 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Your Saved Searches</h3>
          <div className="space-y-2">
            {savedSearches.map((search) => (
              <div key={search.id} className="flex items-center justify-between bg-white p-3 rounded-md">
                <div>
                  <span className="font-medium">{search.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {search.query && `"${search.query}"`}
                    {search.filters.location && ` in ${search.filters.location}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadSavedSearch(search)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteSavedSearch(search.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Query */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Properties
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try '2 bedroom apartment Westlands' or 'furnished house'"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Smart search understands variations like "2br", "two bedroom", "apt", etc.
          </p>
        </div>

        {/* Location with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            ref={locationInputRef}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setLocationInputFocused(true)}
            onBlur={() => setTimeout(() => setLocationInputFocused(false), 200)}
            placeholder="City, area, or neighborhood"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Location Suggestions */}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="font-medium">{suggestion.value}</div>
                  <div className="text-sm text-gray-500">{suggestion.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="townhouse">Townhouse</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAdvancedFilters ? '− Hide' : '+ Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (KES)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="50,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (KES)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="200,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features & Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSearch}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Search Properties
        </button>
        <button
          onClick={clearFilters}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Save This Search</h3>
            <input
              type="text"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Enter a name for this search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentSearch}
                disabled={!saveSearchName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedPropertySearch;