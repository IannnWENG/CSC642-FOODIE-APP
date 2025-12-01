import React from 'react';
import { Star, MapPin, Clock, DollarSign, ChevronRight, Sparkles } from 'lucide-react';

const RecommendationList = ({ recommendations, onSelectPlace, selectedPlace }) => {
  const getPriceLevel = (level) => {
    if (level === undefined) return null;
    return '$'.repeat(level + 1);
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'gradient-mint';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-surface-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Fair';
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-surface-300" />
        </div>
        <h3 className="text-sm font-semibold text-surface-600 mb-1">No places found</h3>
        <p className="text-xs text-surface-400">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recommendations.map((place, index) => (
        <div
          key={place.place_id || index}
          className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 card-interactive ${
            selectedPlace && selectedPlace.place_id === place.place_id
              ? 'bg-brand-50 ring-2 ring-brand-200'
              : 'bg-surface-50 hover:bg-surface-100'
          }`}
          onClick={() => onSelectPlace(place)}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start gap-3">
            {/* Score Badge */}
            <div className={`w-10 h-10 rounded-xl ${getScoreColor(place.recommendationScore)} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">{Math.round(place.recommendationScore)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-surface-800 text-sm truncate">{place.name}</h4>
                {place.recommendationScore >= 70 && (
                  <span className="badge badge-mint text-[10px] flex-shrink-0">
                    <Sparkles className="w-3 h-3" />
                    Top
                  </span>
                )}
              </div>

              {/* Address */}
              <p className="text-xs text-surface-400 truncate mb-2">{place.vicinity}</p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Rating */}
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-semibold">{place.rating || 'N/A'}</span>
                  <span className="text-[10px] text-amber-500">({place.user_ratings_total || 0})</span>
                </div>

                {/* Distance */}
                {place.distance && (
                  <div className="flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs font-medium">{getDistanceText(place.distance)}</span>
                  </div>
                )}

                {/* Price */}
                {place.price_level !== undefined && (
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    <span className="text-xs font-semibold">{getPriceLevel(place.price_level)}</span>
                  </div>
                )}

                {/* Open Status */}
                {place.opening_hours && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    place.opening_hours.open_now 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${place.opening_hours.open_now ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-medium">
                      {place.opening_hours.open_now ? 'Open' : 'Closed'}
                    </span>
                  </div>
                )}
              </div>

              {/* Types */}
              {place.types && place.types.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {place.types.slice(0, 2).map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className="text-[10px] text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full"
                    >
                      {type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;
