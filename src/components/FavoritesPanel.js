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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            <div>
                              <h2 className="text-xl font-bold text-gray-800">My Favorites</h2>
                <p className="text-sm text-gray-500">{stats.total} favorite places</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistics and filtering */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Restaurants {stats.restaurants}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Cafes {stats.cafes}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Others {stats.others}</span>
              </div>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>
        </div>

        {/* Favorites list */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No favorite places yet</p>
              <p className="text-sm text-gray-400">Start exploring and favorite restaurants you like!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFavorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{favorite.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{favorite.vicinity}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {favorite.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{favorite.rating.toFixed(1)}</span>
                          </div>
                        )}
                        
                        {favorite.distance && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{getDistanceText(favorite.distance)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPlace(favorite)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.place_id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {favorite.types && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {favorite.types.slice(0, 3).map((type, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
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
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={() => {
                                  if (window.confirm('Are you sure you want to clear all favorites?')) {
                  favoritesService.clearFavorites();
                  onClose();
                }
              }}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
