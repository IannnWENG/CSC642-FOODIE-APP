import React from 'react';
import { X, Star, MapPin, Globe } from 'lucide-react';
import MenuAIChat from './MenuAIChat';

const MenuModal = ({ place, isOpen, onClose, recommendations = [], userLocation = null }) => {
  if (!isOpen || !place) return null;

  const getPriceLevel = (level) => {
    if (level === undefined) return null;
    return '$'.repeat(level + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col border border-white/20 animate-slideUp sm:animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-2 h-10 sm:h-12 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{place.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {place.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-700">{place.rating}</span>
                    {place.user_ratings_total && (
                      <span className="text-gray-500 text-xs">({place.user_ratings_total})</span>
                    )}
                  </div>
                )}
                {getPriceLevel(place.price_level) && (
                  <span className="text-sm text-green-600 font-medium">
                    {getPriceLevel(place.price_level)}
                  </span>
                )}
                {place.distance && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{place.distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 p-2 rounded-xl transition-all duration-200 flex-shrink-0 active:scale-95"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Restaurant Info */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50/80 border-b border-gray-200/50">
          <p className="text-sm text-gray-600 truncate">{place.vicinity || place.formatted_address}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {place.types && place.types.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
              >
                {type.replace(/_/g, ' ')}
              </span>
            ))}
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Globe className="w-3 h-3" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* AI Chat - Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              🤖 AI Dish Recommendations
            </h3>
            <p className="text-sm text-gray-500">
              Ask our AI assistant for personalized dish recommendations based on your preferences!
            </p>
          </div>
          
          {/* AI Chat Component - Auto Expanded */}
          <MenuAIChat 
            place={place}
            menu={null}
            recommendations={recommendations}
            userLocation={userLocation}
            autoExpand={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
