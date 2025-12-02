import React, { useState, useEffect } from 'react';
import { X, Search, DollarSign, Clock, Star, Filter, Bot } from 'lucide-react';
import googleMapsService from '../services/googleMapsService';
import MenuAIChat from './MenuAIChat';

const MenuModal = ({ place, isOpen, onClose, recommendations = [], userLocation = null }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAISearching, setIsAISearching] = useState(false);

  useEffect(() => {
    if (isOpen && place && place.place_id) {
      setMenu(null);
      setFilteredMenu(null);
      setSearchQuery('');
      setSelectedCategory('all');
      loadMenu();
    }
  }, [isOpen, place, place?.place_id]);

  useEffect(() => {
    if (menu) {
      filterMenu();
    }
  }, [searchQuery, selectedCategory, menu]);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const menuData = await googleMapsService.getRestaurantMenu(place.place_id, place);
      setMenu(menuData);
      if (menuData) {
        filterMenuWithData(menuData);
      }
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMenu = () => {
    if (!menu) return;
    filterMenuWithData(menu);
  };

  const filterMenuWithData = (menuData) => {
    if (!menuData) return;

    let filtered = { ...menuData };

    if (selectedCategory !== 'all') {
      filtered.categories = menuData.categories.filter(category => 
        category.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      filtered.categories = filtered.categories.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
    }

    setFilteredMenu(filtered);
  };

  const getCategories = () => {
    if (!menu) return [];
    return menu.categories.map(category => category.name);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const handleAISearch = async () => {
    if (!place) return;
    
    setIsAISearching(true);
    try {
      const restaurantInfo = {
        name: place.name,
        place_id: place.place_id,
        original_place_id: place.original_place_id,
        restaurantType: place.restaurantType,
        rating: place.rating,
        price_level: place.price_level,
        user_ratings_total: place.user_ratings_total,
        business_status: place.business_status,
        vicinity: place.vicinity,
        formatted_address: place.formatted_address,
        website: place.website,
        formatted_phone_number: place.formatted_phone_number,
        types: place.types,
        reviews: place.reviews,
        photos: place.photos,
        ...place.details
      };
      
      const aiMenu = await googleMapsService.searchMenuWithAI(restaurantInfo);
      
      if (aiMenu && !aiMenu.noMenuAvailable) {
        setMenu(aiMenu);
        filterMenuWithData(aiMenu);
      }
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      setIsAISearching(false);
    }
  };

  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-white/20 animate-slideUp sm:animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200/50 flex-shrink-0 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-2xl font-bold text-gray-800 truncate">{place.name}</h2>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
                {menu && menu.noMenuAvailable ? (
                  <span className="text-xs text-red-500">Menu unavailable</span>
                ) : menu ? (
                  <span className="text-xs text-gray-500">{menu.categories.length} categories • {menu.categories.reduce((total, cat) => total + cat.items.length, 0)} items</span>
                ) : (
                  <span className="text-xs text-gray-500">Loading...</span>
                )}
                {menu && menu.restaurantType && !menu.noMenuAvailable && (
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    {menu.restaurantType}
                  </span>
                )}
                {menu && menu.source === "Real Menu Search" && (
                  <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    ✓ Real
                  </span>
                )}
                {menu && menu.aiGenerated && (
                  <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                    🤖 AI
                  </span>
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

        {/* Search and Filter */}
        <div className="p-3 sm:p-6 border-b border-gray-200/50 bg-gray-50/80 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm w-full sm:w-auto"
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-500 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-gray-500 text-sm sm:text-base">Loading menu...</p>
              </div>
            ) : menu && menu.noMenuAvailable ? (
              <div className="text-center py-6 sm:py-12">
                <div className="text-red-400 mb-3 sm:mb-4">
                  <X className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Unable to Get Menu</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm">{menu.errorMessage}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 max-w-md mx-auto text-left">
                  <p className="text-xs sm:text-sm text-yellow-800 font-medium mb-1">Possible reasons:</p>
                  <ul className="text-xs sm:text-sm text-yellow-700 space-y-0.5">
                    <li>• Incomplete restaurant info</li>
                    <li>• Restaurant closed</li>
                    <li>• Network issues</li>
                  </ul>
                </div>
                
                {/* AI Search Option */}
                {menu.aiSearchAvailable && (
                  <div className="mt-4 sm:mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-3 sm:p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800 text-sm sm:text-base">AI Smart Search</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-700 mb-3">
                      Use AI to search for menu based on restaurant info
                    </p>
                    <button
                      onClick={handleAISearch}
                      disabled={isAISearching}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 active:from-purple-700 active:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {isAISearching ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Searching...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Bot className="w-4 h-4" />
                          AI Search Menu
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                <div className="mt-3 sm:mt-4">
                  <button
                    onClick={loadMenu}
                    className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filteredMenu && filteredMenu.categories.length > 0 ? (
              <div className="space-y-4 sm:space-y-8">
                {/* AI Chat Assistant */}
                <MenuAIChat 
                  place={place}
                  menu={menu}
                  recommendations={recommendations}
                  userLocation={userLocation}
                />
                
                {/* Menu Categories */}
                {filteredMenu.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-6 py-2.5 sm:py-4 border-b border-gray-200 sticky top-0 z-[1]">
                      <h3 className="text-base sm:text-xl font-bold text-gray-800">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{category.items.length} items</p>
                    </div>
                    
                    <div className="p-2 sm:p-6">
                      <div className="space-y-2 sm:space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-100 transition-colors">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</h4>
                                {item.aiRecommended ? (
                                  <span className="inline-flex items-center gap-0.5 text-purple-500 text-[10px] sm:text-xs bg-purple-50 px-1.5 py-0.5 rounded-full">
                                    <Bot className="w-3 h-3" />
                                    AI Pick
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-yellow-600 text-[10px] sm:text-xs bg-yellow-50 px-1.5 py-0.5 rounded-full">
                                    <Star className="w-3 h-3 fill-current" />
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">{item.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0 bg-green-50 px-2 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-sm sm:text-lg font-bold text-green-600 whitespace-nowrap">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-3 sm:mb-4">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">No menu items found</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                  {searchQuery ? 'Try different search terms' : 'Menu not available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {menu && !menu.noMenuAvailable && (
          <div className="p-3 sm:p-6 border-t border-gray-200/50 bg-gray-50/80 flex-shrink-0 safe-area-bottom">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Updated: {new Date(menu.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs">{menu.source}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                  USD $
                </span>
                {place.restaurantType && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                    {place.restaurantType}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuModal;
