import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, RefreshCw, X, Clock, Navigation, Utensils, Coffee, Cake } from 'lucide-react';
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
  const [searchMode, setSearchMode] = useState('nearby');
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

  // Place type options with icons
  const placeTypes = [
    { value: 'restaurant', label: 'Restaurant', icon: Utensils },
    { value: 'cafe', label: 'Cafe', icon: Coffee },
    { value: 'bakery', label: 'Bakery', icon: Cake },
    { value: 'meal_takeaway', label: 'Takeaway', icon: Utensils },
  ];

  // Radius options
  const radiusOptions = [
    { value: 500, label: '500m' },
    { value: 1000, label: '1 km' },
    { value: 2000, label: '2 km' },
    { value: 5000, label: '5 km' },
  ];

  return (
    <div className="card-elevated p-4 sm:p-5 mb-4 sm:mb-5 animate-fadeInUp">
      {/* Header with Location Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userLocation ? 'gradient-mint' : 'bg-surface-200'}`}>
            {isLoading ? (
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Navigation className={`w-5 h-5 ${userLocation ? 'text-white' : 'text-surface-400'}`} />
            )}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-surface-800">
              {userLocation ? 'Location Found' : 'Find Nearby'}
            </h2>
            <p className="text-xs text-surface-400">
              {userLocation 
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : 'Enable location to discover places'
              }
            </p>
          </div>
        </div>
        
        {!userLocation && (
          <button
            onClick={onGetLocation}
            disabled={isLoading}
            className="btn-primary py-2.5 px-4 text-sm w-full sm:w-auto"
          >
            {isLoading ? 'Getting...' : 'Get My Location'}
          </button>
        )}
      </div>

      {/* Search Mode Toggle - Pill Style */}
      <div className="flex p-1 bg-surface-100 rounded-xl mb-4">
        <button
          onClick={() => setSearchMode('nearby')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            searchMode === 'nearby'
              ? 'bg-white text-brand-600 shadow-soft'
              : 'text-surface-500 hover:text-surface-700'
          }`}
        >
          Nearby
        </button>
        <button
          onClick={() => setSearchMode('text')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            searchMode === 'text'
              ? 'bg-white text-brand-600 shadow-soft'
              : 'text-surface-500 hover:text-surface-700'
          }`}
        >
          Search
        </button>
      </div>

      {/* Text Search Input */}
      {searchMode === 'text' && (
        <div className="mb-4" ref={searchInputRef}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
              placeholder="Search restaurants, cafes..."
              className="input-modern pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors"
              >
                <X className="w-4 h-4 text-surface-400" />
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
            <div className="absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-soft-lg border border-surface-100 z-50 max-h-72 overflow-y-auto animate-fadeIn">
              {recentSearches.length > 0 && (
                <div className="p-3 border-b border-surface-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wide">
                    <Clock className="w-3 h-3" />
                    Recent
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
              
              {searchSuggestions.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wide">Suggestions</div>
                  {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2.5 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-sm text-surface-700">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
                      {suggestion.structured_formatting?.secondary_text && (
                        <div className="text-xs text-surface-400 mt-0.5">{suggestion.structured_formatting.secondary_text}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Type Selection - Scrollable Pills */}
      {searchMode === 'nearby' && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Type</label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {placeTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setPlaceType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    placeType === type.value
                      ? 'gradient-brand text-white shadow-glow'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Radius */}
        <div>
          <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Distance</label>
          <div className="flex gap-1.5 flex-wrap">
            {radiusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSearchRadius(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  searchRadius === opt.value
                    ? 'bg-brand-100 text-brand-700 ring-1 ring-brand-200'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Price</label>
          <div className="flex gap-1.5">
            {[
              { value: 'all', label: 'All' },
              { value: 'low', label: '$' },
              { value: 'medium', label: '$$' },
              { value: 'high', label: '$$$' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceRange(opt.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  priceRange === opt.value
                    ? 'bg-accent-mint/10 text-accent-mint ring-1 ring-accent-mint/20'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={searchMode === 'nearby' ? handleSearch : handleTextSearch}
        disabled={isLoading || (searchMode === 'nearby' ? !userLocation : !searchQuery.trim())}
        className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            {searchMode === 'nearby' ? 'Find Places' : 'Search'}
          </>
        )}
      </button>
    </div>
  );
};

export default LocationControls;
