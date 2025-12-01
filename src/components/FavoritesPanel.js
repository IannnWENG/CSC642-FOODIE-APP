import React, { useState } from 'react';
import { Heart, MapPin, Star, Trash2, Filter, X } from 'lucide-react';
import favoritesService from '../services/favoritesService';

const FavoritesPanel = ({ isOpen, onClose, onSelectPlace }) => {
  const [filter, setFilter] = useState('all');
  const favorites = favoritesService.getFavorites();
  const stats = favoritesService.getStats();

  const filteredFavorites = favorites.filter(fav => {
    if (filter === 'all') return true;
    if (filter === 'restaurant') return fav.types && fav.types.includes('restaurant');
    if (filter === 'cafe') return fav.types && fav.types.includes('cafe');
    return true;
  });

  const handleRemoveFavorite = (placeId) => {
    favoritesService.removeFavorite(placeId);
    onClose(); // Re-render
  };

  const getDistanceText = (distance) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-slideUp sm:animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-red-100 p-2 rounded-xl">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Favorites</h2>
              <p className="text-xs sm:text-sm text-gray-500">{stats.total} favorite places</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistics and filtering */}
        <div className="p-3 sm:p-6 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <span>Restaurants {stats.restaurants}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <span>Cafes {stats.cafes}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                <span>Others {stats.others}</span>
              </div>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>
        </div>

        {/* Favorites list */}
        <div className="p-4 sm:p-6 max-h-[45vh] sm:max-h-96 overflow-y-auto overscroll-contain">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-gray-500 text-sm sm:text-base">No favorite places yet</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Start exploring and favorite restaurants you like!</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredFavorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md active:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">{favorite.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{favorite.vicinity}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        {favorite.rating && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            <span>{favorite.rating.toFixed(1)}</span>
                          </div>
                        )}
                        
                        {favorite.distance && (
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{getDistanceText(favorite.distance)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => onSelectPlace(favorite)}
                        className="px-2.5 sm:px-3 py-1.5 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.place_id)}
                        className="p-1.5 sm:p-1 text-red-500 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {favorite.types && (
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                      {favorite.types.slice(0, 3).map((type, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        {favorites.length > 0 && (
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 safe-area-bottom">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all favorites?')) {
                  favoritesService.clearFavorites();
                  onClose();
                }
              }}
              className="px-4 py-2.5 sm:py-2 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors text-sm sm:text-base"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 active:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPanel;
