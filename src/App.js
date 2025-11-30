import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Info, History, X, Bot, LogIn, LogOut } from 'lucide-react';
import MapComponent from './components/MapComponent';
import RecommendationList from './components/RecommendationList';
import LocationControls from './components/LocationControls';
import PlaceDetailModal from './components/PlaceDetailModal';
import FavoritesPanel from './components/FavoritesPanel';
import HelpModal from './components/HelpModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import AIChatModal from './components/AIChatModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { useAuth } from './contexts/AuthContext';
import googleMapsService from './services/googleMapsService';
import aiRecommendationService from './services/aiRecommendationService';
import favoritesService from './services/favoritesService';
import searchHistoryService from './services/searchHistoryService';
import { checkEnvironmentVariables } from './utils/envCheck';

function App() {
  const { user, logout, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [selectedRestaurantForAI, setSelectedRestaurantForAI] = useState(null);

  const convertWeekdayToEnglish = (weekdayText) => {
    if (!weekdayText) return weekdayText;
    
    // Map Chinese weekdays to English
    const weekdayMap = {
      '星期一': 'Monday',
      '星期二': 'Tuesday',
      '星期三': 'Wednesday',
      '星期四': 'Thursday',
      '星期五': 'Friday',
      '星期六': 'Saturday',
      '星期日': 'Sunday',
      '星期天': 'Sunday',
      '週一': 'Monday',
      '週二': 'Tuesday',
      '週三': 'Wednesday',
      '週四': 'Thursday',
      '週五': 'Friday',
      '週六': 'Saturday',
      '週日': 'Sunday',
      '週天': 'Sunday'
    };
    
    let converted = weekdayText;
    // Replace Chinese weekdays with English
    Object.keys(weekdayMap).forEach(chinese => {
      const regex = new RegExp(chinese, 'g');
      converted = converted.replace(regex, weekdayMap[chinese]);
    });
    
    return converted;
  };

  const handleGetLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const location = await googleMapsService.getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      setError(error.message);
      console.error('Failed to get location:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearch = async (searchParams) => {
    if (!userLocation) {
      setError('Please get your location first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const places = await googleMapsService.searchNearbyPlaces(
        userLocation,
        searchParams.type,
        searchParams.radius
      );

      const aiRecommendations = await aiRecommendationService.getRecommendations(
        places,
        userLocation,
        {
          priceRange: searchParams.priceRange,
          distance: searchParams.radius
        }
      );

      const contextualRecommendations = aiRecommendationService.getContextualRecommendations(
        aiRecommendations,
        new Date().getHours(),
        'sunny' 
      );

      setRecommendations(contextualRecommendations);
      
      searchHistoryService.addSearch(searchParams, contextualRecommendations);
    } catch (error) {
      setError(error.message);
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = async (searchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const places = await googleMapsService.searchPlacesByText(
        searchParams.query,
        searchParams.location,
        searchParams.radius
      );

      const placesWithDistance = places.map(place => {
        if (searchParams.location && place.geometry && place.geometry.location) {
          const distance = googleMapsService.calculateDistance(
            searchParams.location,
            place.geometry.location
          );
          return { ...place, distance };
        }
        return place;
      });

      console.log('🔍 Text search places before AI processing:', placesWithDistance.map(p => ({
        name: p.name,
        types: p.types,
        place_id: p.place_id
      })));
      
      const aiRecommendations = await aiRecommendationService.getRecommendations(
        placesWithDistance,
        searchParams.location,
        {
          priceRange: searchParams.priceRange,
          distance: searchParams.radius
        }
      );
      
      console.log('🤖 Text search AI recommendations:', aiRecommendations.map(p => ({
        name: p.name,
        place_id: p.place_id,
        restaurantType: p.restaurantType
      })));


      const contextualRecommendations = aiRecommendationService.getContextualRecommendations(
        aiRecommendations,
        new Date().getHours(),
        'sunny' 
      );

      setRecommendations(contextualRecommendations);
      
      searchHistoryService.addSearch({
        ...searchParams,
        type: 'text_search',
        query: searchParams.query
      }, contextualRecommendations);
    } catch (error) {
      setError(error.message);
      console.error('Text search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlace = async (place) => {
    console.log('handleSelectPlace called with:', place);
    setIsLoading(true);
    try {

      const originalPlaceId = place.original_place_id || place.place_id;
      const details = await googleMapsService.getPlaceDetails(originalPlaceId);
      const placeWithDetails = {
        ...place,
        details: details,
        place_id: place.place_id
      };
      setSelectedPlace(placeWithDetails);
      setShowPlaceDetail(true);
    } catch (error) {
      console.error('Failed to get place details:', error);
      setSelectedPlace(place);
      setShowPlaceDetail(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurantForAI(restaurant);
    
    try {
      const menu = await googleMapsService.getRestaurantMenu(restaurant.place_id, restaurant);
      const restaurantWithMenu = {
        ...restaurant,
        menu: menu
      };
      setSelectedRestaurantForAI(restaurantWithMenu);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
    
    setShowAIChat(true);
  };

  const handleRestaurantAnalysis = (restaurant, analysis) => {
    console.log('Restaurant analysis completed:', restaurant.name, analysis);

  };

  const handleFavorite = (place) => {
    if (favoritesService.isFavorite(place.place_id)) {
      favoritesService.removeFavorite(place.place_id);
    } else {
      favoritesService.addFavorite(place);
    }
    setFavoritesCount(favoritesService.getFavorites().length);
  };

  const updateFavoritesCount = () => {
    setFavoritesCount(favoritesService.getFavorites().length);
  };

  useEffect(() => {
    const envStatus = checkEnvironmentVariables();
    if (!envStatus.isConfigured) {
      console.warn('⚠️ Environment variables are not correctly set:', envStatus.missing);
    }
    
    // If not logged in, automatically show login interface
    if (!isAuthenticated) {
      setShowLogin(true);
      setShowRegister(false);
    } else {
      // After login, close all login/register modal boxes
      setShowLogin(false);
      setShowRegister(false);
      handleGetLocation();
      updateFavoritesCount();
    }
  }, [isAuthenticated]);

  // If not logged in, only show login/register interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <LoginModal
          isOpen={showLogin}
          onClose={() => {
            // When not logged in, cannot close, but will automatically close after login
            if (isAuthenticated) {
              setShowLogin(false);
            }
          }}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          canClose={false}
        />
        <RegisterModal
          isOpen={showRegister}
          onClose={() => {
            // When not logged in, cannot close, but will automatically close after registration
            if (isAuthenticated) {
              setShowRegister(false);
            }
          }}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          canClose={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Restaurant Recommender
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">AI-powered nearby food recommendations</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
                    title="Login"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                    title="Sign Up"
                  >
                    Sign Up
                  </button>
                </>
              )}
              
              <button
                onClick={() => setShowAIChat(true)}
                className="p-3 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                title="AI Restaurant Assistant"
              >
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={() => setShowFavorites(true)}
                className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                title="My Favorites"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setShowSearchHistory(true)}
                className="p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                title="Search History"
              >
                <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={() => setShowHelp(true)}
                className="p-3 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                title="Help & Instructions"
              >
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setError(null)}
            retryText="Close"
          />
        )}

        <LocationControls
          onGetLocation={handleGetLocation}
          onSearch={handleSearch}
          onTextSearch={handleTextSearch}
          isLoading={isLoading}
          userLocation={userLocation}
        />


        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 animate-fadeInUp">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className="w-2 h-4 sm:h-6 lg:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Interactive Map</h3>
              </div>
              <div className="h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <MapComponent
                  userLocation={userLocation}
                  recommendations={recommendations}
                  onLocationSelect={handleSelectPlace}
                  onRestaurantClick={handleRestaurantClick}
                />
              </div>
            </div>
          </div>

          
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 animate-slideInRight">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className="w-2 h-4 sm:h-6 lg:h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">AI Recommendations</h3>
              </div>
              <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {isLoading ? (
                  <LoadingSpinner message="Searching..." />
                ) : (
                  <RecommendationList
                    recommendations={recommendations}
                    onSelectPlace={handleSelectPlace}
                    selectedPlace={selectedPlace}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedPlace && selectedPlace.details && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Place Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{selectedPlace.details.name}</h4>
                <p className="text-gray-600 mb-2">{selectedPlace.details.formatted_address}</p>
                
                {selectedPlace.details.formatted_phone_number && (
                  <p className="text-gray-600 mb-2">
                    Phone: {selectedPlace.details.formatted_phone_number}
                  </p>
                )}
                
                {selectedPlace.details.website && (
                  <a
                    href={selectedPlace.details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Official Website
                  </a>
                )}
              </div>
              
              <div>
                {selectedPlace.details.opening_hours && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Opening Hours</h5>
                    <div className="text-sm text-gray-600">
                      {selectedPlace.details.opening_hours.weekday_text?.map((time, index) => (
                        <div key={index}>{convertWeekdayToEnglish(time)}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPlace.details.reviews && selectedPlace.details.reviews.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Latest Reviews</h5>
                    <div className="text-sm text-gray-600">
                      <p className="italic">"{selectedPlace.details.reviews[0].text}"</p>
                      <p className="mt-1 text-xs text-gray-500">
                        - {selectedPlace.details.reviews[0].author_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-40 sm:hidden">
        <div className="flex items-center justify-around py-2">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <LogIn className="w-6 h-6" />
              <span className="text-xs font-medium">Login</span>
            </button>
          )}
          
          <button
            onClick={() => setShowAIChat(true)}
            className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-purple-500 transition-colors"
          >
            <Bot className="w-6 h-6" />
            <span className="text-xs font-medium">AI Agent</span>
          </button>
          
          <button
            onClick={() => setShowFavorites(true)}
            className="relative flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {favoritesCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowSearchHistory(true)}
            className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>
          
          <button
            onClick={() => setShowHelp(true)}
            className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-green-500 transition-colors"
          >
            <Info className="w-6 h-6" />
            <span className="text-xs font-medium">Help</span>
          </button>
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className="bg-white border-t mt-12 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>Restaurant Recommender - Powered by Google Maps API and AI recommendation technology</p>
            <p className="mt-1">Please ensure location permissions are enabled for the best experience</p>
          </div>
        </div>
      </footer>

      <PlaceDetailModal
        place={selectedPlace}
        isOpen={showPlaceDetail}
        onClose={() => setShowPlaceDetail(false)}
        onFavorite={handleFavorite}
        isFavorite={selectedPlace ? favoritesService.isFavorite(selectedPlace.place_id) : false}
        recommendations={recommendations}
        userLocation={userLocation}
      />

      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => {
          setShowFavorites(false);
          updateFavoritesCount();
        }}
        onSelectPlace={handleSelectPlace}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
      {showSearchHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-blue-500" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Search History</h2>
                  <p className="text-sm text-gray-500">{searchHistoryService.getStats().totalSearches} searches</p>
                </div>
              </div>
              <button
                onClick={() => setShowSearchHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {searchHistoryService.getHistory().length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No search history</p>
                  <p className="text-sm text-gray-400">Start searching for restaurants to build your history!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchHistoryService.getHistory().map((record) => (
                    <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{searchHistoryService.getTypeName(record.params.type)}</span>
                          <span className="text-sm text-gray-500">
                            {record.params.radius}m • {searchHistoryService.getPriceRangeName(record.params.priceRange)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {searchHistoryService.formatTimestamp(record.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Found {record.resultsCount} results
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all search history?')) {
                    searchHistoryService.clearHistory();
                    setShowSearchHistory(false);
                  }
                }}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear History
              </button>
              <button
                onClick={() => setShowSearchHistory(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAIChat && (
        <AIChatModal
          isOpen={showAIChat}
          onClose={() => {
            setShowAIChat(false);
            setSelectedRestaurantForAI(null);
          }}
          recommendations={recommendations}
          userLocation={userLocation}
          selectedRestaurant={selectedRestaurantForAI}
          onRestaurantAnalysis={handleRestaurantAnalysis}
        />
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        canClose={true}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        canClose={true}
      />
    </div>
  );
}

export default App;
