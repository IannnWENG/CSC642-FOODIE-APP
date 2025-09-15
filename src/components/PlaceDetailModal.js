import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Phone, Globe, Heart, Share2, Navigation, ChevronDown, ChevronUp, Filter, SortAsc, MessageSquare, Menu } from 'lucide-react';
import ReviewsModal from './ReviewsModal';
import MenuModal from './MenuModal';

const PlaceDetailModal = ({ place, isOpen, onClose, onFavorite, isFavorite, recommendations = [], userLocation = null }) => {
  if (!isOpen || !place) return null;

  const details = place.details || {};
  const rating = place.rating || details.rating || 0;
  const userRatingsTotal = place.user_ratings_total || details.user_ratings_total || 0;
  
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewSortBy, setReviewSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [reviewFilter, setReviewFilter] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const getPriceLevel = (level) => {
    if (level === undefined) return 'Price unknown';
    return '$'.repeat(level + 1) + ' (Under $' + ((level + 1) * 20) + ')';
  };

  const getDistanceText = (distance) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `I recommend this restaurant: ${place.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Copy to clipboard
      const text = `I recommend this restaurant: ${place.name} - ${place.vicinity}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Restaurant information copied to clipboard');
      });
    }
  };

  const handleDirections = () => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getProcessedReviews = () => {
    if (!details.reviews || details.reviews.length === 0) return [];
    
    let processedReviews = [...details.reviews];
    

    if (reviewFilter !== 'all') {
      const targetRating = parseInt(reviewFilter);
      processedReviews = processedReviews.filter(review => review.rating === targetRating);
    }
    
    switch (reviewSortBy) {
      case 'newest':
        processedReviews.sort((a, b) => b.time - a.time);
        break;
      case 'oldest':
        processedReviews.sort((a, b) => a.time - b.time);
        break;
      case 'highest':
        processedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        processedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    return processedReviews;
  };

  const processedReviews = getProcessedReviews();
  const reviewsToShow = showAllReviews ? processedReviews : processedReviews.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 border-b border-gray-200/50">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
              {place.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Basic information */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 mb-2">{place.vicinity || details.formatted_address}</p>
                
                {place.distance && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{getDistanceText(place.distance)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMenuModal(true)}
                  className="p-3 text-gray-500 hover:text-green-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200"
                  title="View Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onFavorite(place)}
                  className={`p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isFavorite ? 'text-red-500 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' : 'text-gray-500 hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 border border-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 text-gray-500 hover:text-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rating and price */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{rating.toFixed(1)}</span>
                <span className="text-gray-600 text-sm">({userRatingsTotal} reviews)</span>
              </div>
              
              {place.price_level !== undefined && (
                <div className="bg-green-50 px-4 py-2 rounded-xl">
                  <span className="text-gray-700 font-semibold">{getPriceLevel(place.price_level)}</span>
                </div>
              )}
            </div>

            {/* Business status */}
            {details.opening_hours && (
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  details.opening_hours.open_now 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {details.opening_hours.open_now ? 'Open now' : 'Closed'}
                </span>
              </div>
            )}
          </div>

          {/* Contact information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {details.formatted_phone_number && (
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                <Phone className="w-5 h-5 text-blue-500" />
                <a
                  href={`tel:${details.formatted_phone_number}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                >
                  {details.formatted_phone_number}
                </a>
              </div>
            )}
            
            {details.website && (
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
                <Globe className="w-5 h-5 text-green-500" />
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 transition-colors font-semibold"
                >
                  Official Website
                </a>
              </div>
            )}
          </div>

          {/* Opening hours */}
          {details.opening_hours && details.opening_hours.weekday_text && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">Opening Hours</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {details.opening_hours.weekday_text.map((time, index) => (
                  <div key={index} className="text-sm text-gray-700 font-medium">
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {details.reviews && details.reviews.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-800">Reviews ({processedReviews.length})</h3>
                </div>
                
                {/* View all reviews button */}
                <button
                  onClick={() => setShowReviewsModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  View All Reviews
                </button>
                
                {/* Review controls */}
                <div className="flex items-center gap-2">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={reviewSortBy}
                      onChange={(e) => setReviewSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                    <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  {/* Filter dropdown */}
                  <div className="relative">
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Reviews list */}
              <div className="space-y-4">
                {reviewsToShow.map((review, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-sm text-gray-700">{review.author_name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {new Date(review.time * 1000).toLocaleDateString('en-US')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>
                    
                    {/* Review helpfulness buttons */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                        <span>👍</span>
                        <span>Helpful</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                        <span>👎</span>
                        <span>Not Helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show more/less button */}
              {processedReviews.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="flex items-center gap-2 mx-auto px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    {showAllReviews ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show All Reviews ({processedReviews.length})
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Rating distribution */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Rating Distribution</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = processedReviews.filter(r => r.rating === rating).length;
                    const percentage = processedReviews.length > 0 ? (count / processedReviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Type tags */}
          {place.types && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {place.types.slice(0, 5).map((type, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium border border-blue-200"
                  >
                    {type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100">
          <button
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-3 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            Get Directions
          </button>
          <button
            onClick={onClose}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Reviews Modal */}
      <ReviewsModal
        place={place}
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
      />
      
      {/* Menu Modal */}
      <MenuModal
        place={place}
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        recommendations={recommendations}
        userLocation={userLocation}
      />
    </div>
  );
};

export default PlaceDetailModal;
