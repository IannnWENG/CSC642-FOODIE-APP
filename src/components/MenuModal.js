import React, { useState, useEffect } from 'react';
import { X, Search, DollarSign, Clock, Star, Filter, Globe, ChevronDown, Bot } from 'lucide-react';
import googleMapsService from '../services/googleMapsService';
import currencyService from '../services/currencyService';
import MenuAIChat from './MenuAIChat';

const MenuModal = ({ place, isOpen, onClose, recommendations = [], userLocation = null }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCurrency, setCurrentCurrency] = useState(currencyService.getCurrentCurrency());
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);

  useEffect(() => {
    if (isOpen && place && place.place_id) {
      setMenu(null);
      setFilteredMenu(null);
      setSearchQuery('');
      setSelectedCategory('all');
      setShowCurrencyDropdown(false);
      loadMenu();
    }
  }, [isOpen, place, place?.place_id]);

  useEffect(() => {
    if (menu) {
      filterMenu();
    }
  }, [searchQuery, selectedCategory, menu]);
   
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCurrencyDropdown && !event.target.closest('.currency-dropdown')) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCurrencyDropdown]);

  const loadMenu = async () => {
    setLoading(true);
    try {
      console.log('🍽️ Loading menu for place:', {
        name: place.name,
        place_id: place.place_id,
        original_place_id: place.original_place_id,
        restaurantType: place.restaurantType
      });
      
      const menuData = await googleMapsService.getRestaurantMenu(place.place_id, place);
      console.log('📋 Menu data loaded:', menuData);
      
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
    const convertedPrice = currencyService.convertPrice(price, 'USD', currentCurrency);
    return currencyService.formatPrice(convertedPrice, currentCurrency);
  };

  const handleCurrencyChange = (currencyCode) => {
    setCurrentCurrency(currencyCode);
    currencyService.setCurrentCurrency(currencyCode);
    setShowCurrencyDropdown(false);
  };

  const handleAISearch = async () => {
    if (!place) return;
    
    setIsAISearching(true);
    try {
      console.log('🤖 Starting AI menu search...');
      
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
        ...place.details // Include detailed information
      };
      
      const aiMenu = await googleMapsService.searchMenuWithAI(restaurantInfo);
      
      if (aiMenu && !aiMenu.noMenuAvailable) {
        console.log('✅ AI search successfully got menu');
        setMenu(aiMenu);
        filterMenuWithData(aiMenu);
      } else {
        console.log('❌ AI search unable to get menu');
      }
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      setIsAISearching(false);
    }
  };

  const getCurrentCurrencyInfo = () => {
    return currencyService.getCurrentCurrencyInfo();
  };

  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menu && menu.noMenuAvailable ? `${place.name} - Menu Unavailable` : `${place.name} Menu`}
              </h2>
              <p className="text-sm text-gray-500">
                {menu && menu.noMenuAvailable ? (
                  <span className="text-red-500">Menu information unavailable</span>
                ) : menu ? (
                  `${menu.categories.length} categories, ${menu.categories.reduce((total, cat) => total + cat.items.length, 0)} items total`
                ) : (
                  'Loading menu...'
                )}
                {menu && menu.restaurantType && !menu.noMenuAvailable && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {menu.restaurantType} cuisine
                  </span>
                )}
                {menu && menu.source === "Real Menu Search" && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ✓ Real Menu
                  </span>
                )}
                {menu && menu.aiGenerated && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    🤖 AI Search Result
                  </span>
                )}
                {menu && menu.searchQuery && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">AI Search Query:</span>
                    <span className="italic">{menu.searchQuery}</span>
                  </div>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200/50 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Currency Converter */}
            <div className="relative currency-dropdown">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{getCurrentCurrencyInfo().flag} {getCurrentCurrencyInfo().code}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2">選擇貨幣</div>
                    {currencyService.getSupportedCurrencies().map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCurrencyChange(currency.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                          currentCurrency === currency.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{currency.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{currency.name}</div>
                          <div className="text-xs text-gray-500">{currency.code} {currency.symbol}</div>
                        </div>
                        {currentCurrency === currency.code && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading menu...</p>
              </div>
            ) : menu && menu.noMenuAvailable ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                  <X className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Get Menu Information</h3>
                <p className="text-gray-600 mb-4">{menu.errorMessage}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-yellow-800">
                    <strong>Possible reasons:</strong>
                  </p>
                  <ul className="text-sm text-yellow-700 mt-2 text-left">
                    <li>• Incomplete restaurant information</li>
                    <li>• Restaurant temporarily or permanently closed</li>
                    <li>• Restaurant rating too low</li>
                    <li>• Network connection issues</li>
                    <li>• Restaurant does not provide online menu</li>
                  </ul>
                </div>
                
                {/* AI Search Option - Only show when allowed */}
                {menu.aiSearchAvailable && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">AI Smart Menu Search</h4>
                    </div>
                    <p className="text-sm text-purple-700 mb-4">
                      Use AI technology to analyze all restaurant information (name, address, rating, reviews, type, etc.) to search for related menu
                    </p>
                    <button
                      onClick={handleAISearch}
                      disabled={isAISearching}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAISearching ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          AI Searching...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          Use AI to Search Menu
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    onClick={loadMenu}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Retry Loading Menu
                  </button>
                </div>
              </div>
            ) : filteredMenu && filteredMenu.categories.length > 0 ? (
              <div className="space-y-8">
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
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.items.length} items</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid gap-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                {item.aiRecommended ? (
                                  <div className="flex items-center gap-1 text-purple-500">
                                    <Bot className="w-4 h-4" />
                                    <span className="text-sm font-medium">AI Recommended</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium">Popular</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-lg font-bold text-green-600">
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
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">No menu items found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchQuery ? 'Try adjusting your search terms' : 'Menu information is not available for this restaurant'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {menu && (
          <div className="p-6 border-t border-gray-200/50 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date(menu.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Source: {menu.source}</span>
                <span>•</span>
                <span>Original Currency: {menu.currency}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Display: {getCurrentCurrencyInfo().flag} {getCurrentCurrencyInfo().code}
                </span>
                {place.restaurantType && (
                  <>
                    <span>•</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Type: {place.restaurantType}
                    </span>
                  </>
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
