import React, { useState } from 'react';
import { X, Star, Filter, SortAsc, ChevronLeft, ChevronRight, Search, Languages, Loader2 } from 'lucide-react';
import translateService from '../services/translateService';

const ReviewsModal = ({ place, isOpen, onClose }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [translations, setTranslations] = useState({});
  const [translatingIds, setTranslatingIds] = useState(new Set());
  const reviewsPerPage = 5;

  if (!isOpen || !place || !place.details || !place.details.reviews) return null;

  const reviews = place.details.reviews || [];
  
  const getProcessedReviews = () => {
    let processedReviews = [...reviews];

    if (searchTerm) {
      processedReviews = processedReviews.filter(review => 
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (filter !== 'all') {
      const targetRating = parseInt(filter);
      processedReviews = processedReviews.filter(review => review.rating === targetRating);
    }
    
    switch (sortBy) {
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
  const totalPages = Math.ceil(processedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = processedReviews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    processedReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  // Translation handler
  const handleTranslate = async (reviewIndex, text) => {
    const reviewId = `${reviewIndex}-${text.substring(0, 20)}`;
    
    if (translations[reviewId]) {
      // Toggle translation off
      setTranslations(prev => {
        const updated = { ...prev };
        delete updated[reviewId];
        return updated;
      });
      return;
    }

    setTranslatingIds(prev => new Set([...prev, reviewId]));
    
    try {
      const result = await translateService.translateToEnglish(text);
      if (result.isTranslated) {
        setTranslations(prev => ({
          ...prev,
          [reviewId]: result.translated
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslatingIds(prev => {
        const updated = new Set(prev);
        updated.delete(reviewId);
        return updated;
      });
    }
  };

  // Check if review needs translation
  const needsTranslation = (text) => {
    return translateService.isNonEnglish(text);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-white/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full flex-shrink-0"></div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{place.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500">{processedReviews.length} reviews</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-6 border-b border-gray-200/50 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            {/* Sort and filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative flex-shrink-0">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 sm:p-6">
            {/* Rating distribution */}
            <div className="mb-6 sm:mb-8 bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Rating Distribution</h3>
              <div className="space-y-2 sm:space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = distribution[rating];
                  const percentage = processedReviews.length > 0 ? (count / processedReviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 w-10 sm:w-16">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">{rating}</span>
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 w-6 sm:w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4 sm:space-y-6">
              {currentReviews.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">No reviews found</p>
                </div>
              ) : (
                currentReviews.map((review, index) => {
                  const reviewId = `${startIndex + index}-${review.text.substring(0, 20)}`;
                  const isTranslating = translatingIds.has(reviewId);
                  const translation = translations[reviewId];
                  const showTranslateButton = needsTranslation(review.text);
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                      {/* Review header */}
                      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-700 text-sm sm:text-base">{review.author_name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {new Date(review.time * 1000).toLocaleDateString('en-US')}
                          </span>
                        </div>
                        <span className="text-sm sm:text-lg font-bold text-gray-600 flex-shrink-0">{review.rating}/5</span>
                      </div>
                      
                      {/* Review text */}
                      <div className="mb-3 sm:mb-4">
                        {translation ? (
                          <div className="space-y-2">
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{translation}</p>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed italic border-l-2 border-gray-200 pl-3">
                              Original: {review.text}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{review.text}</p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-100">
                        {showTranslateButton && (
                          <button 
                            onClick={() => handleTranslate(startIndex + index, review.text)}
                            disabled={isTranslating}
                            className={`flex items-center gap-1.5 text-xs sm:text-sm transition-colors ${
                              translation 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'text-gray-500 hover:text-blue-500'
                            } disabled:opacity-50`}
                          >
                            {isTranslating ? (
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span>{translation ? 'Show original' : 'Translate'}</span>
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-blue-500 transition-colors">
                          <span>👍</span>
                          <span>Helpful</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors">
                          <span>👎</span>
                          <span>Not Helpful</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
