import React from 'react';
import { Star, MapPin, Clock, Phone, Globe, DollarSign } from 'lucide-react';

const RecommendationList = ({ recommendations, onSelectPlace, selectedPlace }) => {
  const getPriceLevel = (level) => {
    if (level === undefined) return 'Price unknown';
    return '$'.repeat(level + 1) + ' (Under $' + ((level + 1) * 20) + ')';
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const getRecommendationBadge = (score) => {
    if (score >= 70) {
      return <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Highly Recommended</span>;
    } else if (score >= 50) {
      return <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Recommended</span>;
    } else {
      return <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Average</span>;
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <p className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No recommendations found</p>
          <p className="text-xs sm:text-sm text-gray-500">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 sm:h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Recommendations</h3>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
          {recommendations.length} places
        </span>
      </div>

      {recommendations.map((place, index) => (
        <div
          key={place.place_id || index}
          className={`bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
            selectedPlace && selectedPlace.place_id === place.place_id
              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg ring-2 ring-blue-200'
              : 'border-gray-200/50 hover:border-blue-300 shadow-sm hover:shadow-lg'
          }`}
          onClick={() => onSelectPlace(place)}
        >
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg truncate">{place.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium truncate">{place.vicinity}</p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:gap-3">
                {getRecommendationBadge(place.recommendationScore)}
                <div className="text-right">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 bg-yellow-50 px-2 sm:px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{place.rating || 'N/A'}</span>
                    <span className="text-gray-400 text-xs">
                      ({place.user_ratings_total || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              {place.distance && (
                <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">{getDistanceText(place.distance)}</span>
                </div>
              )}
              {place.price_level !== undefined && (
                <div className="flex items-center gap-1 sm:gap-2 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{getPriceLevel(place.price_level)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1 sm:gap-2">
                {place.opening_hours && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className={`font-medium ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                      {place.opening_hours.open_now ? 'Open' : 'Closed'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {place.formatted_phone_number && (
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                )}
                {place.website && (
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                )}
              </div>
            </div>

            {place.types && (
              <div className="flex flex-wrap gap-1">
                {place.types.slice(0, 3).map((type, typeIndex) => (
                  <span
                    key={typeIndex}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;
