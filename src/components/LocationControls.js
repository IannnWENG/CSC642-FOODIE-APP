import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, RefreshCw, X, Clock } from 'lucide-react';
import googleMapsService from '../services/googleMapsService';

const LocationControls = ({ 
  onGetLocation, 
  onSearch, 
  onTextSearch,
  isLoading, 
  userLocation,
  onFilterChange 
}) => {
  const [searchRadius, setSearchRadius] = useState(1000);
  const [placeType, setPlaceType] = useState('restaurant');
  const [priceRange, setPriceRange] = useState('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState('nearby'); // 'nearby' or 'text'
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchInputRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  const handleSearch = () => {
    onSearch({
      radius: searchRadius,
      type: placeType,
      priceRange: priceRange
    });
  };

  const handleTextSearch = () => {
    if (!searchQuery.trim()) return;
    
    // 添加到最近搜尋
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    onTextSearch({
      query: searchQuery,
      location: userLocation,
      radius: searchRadius,
      priceRange: priceRange
    });
    
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 2) {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await googleMapsService.getPlaceAutocomplete(value, userLocation, searchRadius);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLocationText = () => {
    if (!userLocation) return 'Location not obtained yet';
    return `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Location & Search Settings
        </h2>
      </div>

      {/* Location information */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Current Location</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 bg-white/50 px-2 sm:px-3 py-1 rounded-lg truncate">
              {getLocationText()}
            </p>
          </div>
          <button
            onClick={onGetLocation}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {isLoading ? 'Getting...' : 'Get Location'}
          </button>
        </div>
      </div>

      {/* Search mode toggle */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-800">Search Mode</h3>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setSearchMode('nearby')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              searchMode === 'nearby'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Nearby Search
          </button>
          <button
            onClick={() => setSearchMode('text')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              searchMode === 'text'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Text Search
          </button>
        </div>
      </div>

      {/* Text search input */}
      {searchMode === 'text' && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-800">Search Restaurants</h3>
          </div>
          <div className="relative" ref={searchInputRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                placeholder="Enter restaurant name or address..."
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search suggestions */}
            {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                {searchSuggestions.length > 0 && (
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-500 mb-2">Suggestions</div>
                    {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="font-medium">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
                        {suggestion.structured_formatting?.secondary_text && (
                          <div className="text-xs text-gray-500 mt-1">{suggestion.structured_formatting.secondary_text}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {/* Search radius */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Search Radius
          </label>
          <select
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
          >
            <option value={500}>500 meters</option>
            <option value={1000}>1 km</option>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
          </select>
        </div>

        {/* Place type */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Place Type
          </label>
          <select
            value={placeType}
            onChange={(e) => setPlaceType(e.target.value)}
            className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
          >
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="meal_takeaway">Takeaway</option>
            <option value="food">Food</option>
            <option value="bakery">Bakery</option>
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
          >
            <option value="all">Any</option>
            <option value="low">$ (Budget)</option>
            <option value="medium">$$ (Moderate)</option>
            <option value="high">$$$ (Expensive)</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 bg-gray-50/50 px-3 sm:px-4 py-2 rounded-xl w-full sm:w-auto">
          <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
          <span className="font-medium text-center sm:text-left">
            {searchMode === 'nearby' 
              ? 'AI recommendations will be sorted by rating, distance, price, and other factors'
              : 'Search for specific restaurants by name or address'
            }
          </span>
        </div>
        
        {searchMode === 'nearby' ? (
          <button
            onClick={handleSearch}
            disabled={isLoading || !userLocation}
            className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Search Nearby
          </button>
        ) : (
          <button
            onClick={handleTextSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Search Restaurants
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationControls;
