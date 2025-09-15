import React, { useState } from 'react';
import { X, Star, Filter, SortAsc, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const ReviewsModal = ({ place, isOpen, onClose }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
    window.scrollTo(0, 0);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    processedReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{place.name} Reviews</h2>
              <p className="text-sm text-gray-500">{processedReviews.length} reviews</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200/50 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search review content or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Sort and filter */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Rating distribution */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = distribution[rating];
                  const percentage = processedReviews.length > 0 ? (count / processedReviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium text-gray-600">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-6">
              {currentReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No reviews found matching your criteria</p>
                </div>
              ) : (
                currentReviews.map((review, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
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
                        <span className="font-semibold text-gray-700">{review.author_name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(review.time * 1000).toLocaleDateString('en-US')}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-600">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.text}</p>
                    
                    {/* Review interactions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        <span>👍</span>
                        <span>Helpful</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
                        <span>👎</span>
                        <span>Not Helpful</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
                        <span>💬</span>
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
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
