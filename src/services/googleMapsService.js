import { Loader } from '@googlemaps/js-api-loader';
import realMenuService from './realMenuService';

class GoogleMapsService {
  constructor() {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      throw new Error('Google Maps API key is required. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.');
    }
    
    this.loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places']
    });
    this.map = null;
    this.placesService = null;
  }

  async initializeMap(container, options = {}) {
    try {
      const google = await this.loader.load();
      
      const defaultOptions = {
        zoom: 15,
        center: { lat: 25.0330, lng: 121.5654 }, // Taipei default location
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        ...options
      };

      this.map = new google.maps.Map(container, defaultOptions);
      this.placesService = new google.maps.places.PlacesService(this.map);
      
      return { map: this.map, placesService: this.placesService };
    } catch (error) {
      console.error('Google Maps initialization failed:', error);
      throw error;
    }
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // 降級方案：使用預設位置（台北）
        console.warn('Geolocation not supported, using default location');
        resolve({ lat: 25.0330, lng: 121.5654 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(location);
        },
        (error) => {
          console.warn('Geolocation failed, using default location:', error);
          // 降級方案：使用預設位置
          resolve({ lat: 25.0330, lng: 121.5654 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  async searchNearbyPlaces(location, type = 'restaurant', radius = 1000) {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        location: location,
        radius: radius,
        type: type,
        language: 'en'
      };

      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(new Error(`Search failed: ${status}`));
        }
      });
    });
  }

  async searchPlacesByText(query, location = null, radius = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        query: query,
        language: 'en',
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'price_level', 'types', 'photos']
      };

      // 如果提供了位置，添加位置偏置
      if (location) {
        request.location = location;
        request.radius = radius;
      }

      this.placesService.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(new Error(`Text search failed: ${status}`));
        }
      });
    });
  }

  async getPlaceAutocomplete(input, location = null, radius = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        input: input,
        language: 'en',
        types: ['establishment']
      };

      if (location) {
        request.location = location;
        request.radius = radius;
      }

      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions || []);
        } else {
          reject(new Error(`Autocomplete failed: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        placeId: placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'formatted_phone_number', 'formatted_address', 'opening_hours', 'photos', 'reviews', 'price_level', 'website', 'types', 'editorial_summary', 'current_opening_hours', 'business_status']
      };

      this.placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error(`Failed to get details: ${status}`));
        }
      });
    });
  }

  createMarker(location, title = '', map = this.map) {
    if (!map) return null;
    
    return new google.maps.Marker({
      position: location,
      map: map,
      title: title
    });
  }

  setMapCenter(location) {
    if (this.map) {
      this.map.setCenter(location);
    }
  }

  calculateDistance(point1, point2) {
    const R = 6371e3; // 地球半徑（米）
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // 距離（米）
  }

  // 獲取餐廳菜單資訊（優先搜尋真實菜單）
  async getRestaurantMenu(placeId, restaurantInfo = null) {
    try {
      console.log('🍽️ 開始獲取餐廳菜單:', {
        name: restaurantInfo?.name,
        placeId: placeId
      });

      // 使用新的真實菜單搜尋服務
      const menu = await realMenuService.getRestaurantMenu(placeId, restaurantInfo);
      
      if (menu && !menu.noMenuAvailable) {
        console.log('✅ 成功獲取菜單:', menu.source);
        return menu;
      }

      // 如果真實菜單搜尋失敗，回退到原有的動態生成方法
      console.log('🔄 回退到動態菜單生成...');
      const realPlaceDetails = await this.getPlaceDetails(placeId);
      
      if (!this.isValidRestaurant(realPlaceDetails)) {
        console.log('❌ Invalid restaurant data, cannot generate menu');
        return this.createNoMenuResponse(placeId, 'Invalid restaurant data', restaurantInfo);
      }
      
      if (!this.hasEnoughInfoForMenu(realPlaceDetails)) {
        console.log('❌ Insufficient restaurant information for menu generation');
        return this.createNoMenuResponse(placeId, 'Insufficient restaurant information', restaurantInfo);
      }
      
      const dynamicMenu = this.generateDynamicMenuFromRealData(placeId, realPlaceDetails, restaurantInfo);
      return dynamicMenu;
      
    } catch (error) {
      console.error('Failed to get restaurant menu:', error);
      return this.createNoMenuResponse(placeId, 'Unable to retrieve restaurant information', restaurantInfo);
    }
  }

  isValidRestaurant(placeDetails) {
    if (!placeDetails) return false;
    
    const hasName = placeDetails.name && placeDetails.name.trim().length > 0;
    const hasRating = placeDetails.rating !== undefined && placeDetails.rating > 0;
    const hasTypes = placeDetails.types && placeDetails.types.length > 0;
    
    const isRestaurantType = placeDetails.types.some(type => 
      ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type)
    );
    
    return hasName && hasRating && hasTypes && isRestaurantType;
  }

  hasEnoughInfoForMenu(placeDetails) {
    if (!placeDetails) return false;
    
    const hasName = placeDetails.name && placeDetails.name.trim().length > 0;
    const hasRating = placeDetails.rating !== undefined;
    const hasTypes = placeDetails.types && placeDetails.types.length > 0;
    
    return hasName && hasRating && hasTypes;
  }

  createNoMenuResponse(placeId, reason, restaurantInfo = null) {
    return {
      placeId: placeId,
      lastUpdated: new Date().toISOString(),
      categories: [],
      currency: "USD",
      availability: "Unavailable",
      source: "Google Maps API",
      restaurantName: restaurantInfo?.name || "Unknown",
      restaurantType: restaurantInfo?.restaurantType || "unknown",
      rating: restaurantInfo?.rating || 0,
      priceLevel: restaurantInfo?.price_level || 0,
      userRatingsTotal: restaurantInfo?.user_ratings_total || 0,
      error: true,
      errorMessage: `無法取得菜單：${reason}`,
      noMenuAvailable: true,
      aiSearchAvailable: true, 
      originalRestaurantInfo: restaurantInfo
    };
  }

  async searchMenuWithAI(restaurantInfo) {
    try {
      console.log('🤖 使用AI搜尋菜單:', restaurantInfo.name);
      
      const aiMenu = await realMenuService.searchMenuWithAI(restaurantInfo);
      
      if (aiMenu && !aiMenu.noMenuAvailable) {
        console.log('✅ AI搜尋成功獲取菜單');
        return aiMenu;
      }
      
      return this.createNoMenuResponse(
        restaurantInfo.place_id || 'ai_search', 
        'AI無法找到此餐廳的菜單資訊', 
        restaurantInfo
      );
      
    } catch (error) {
      console.error('AI menu search failed:', error);
      throw new Error('AI 搜尋菜單失敗');
    }
  }

  buildAIMenuSearchQuery(restaurantInfo) {
    const name = restaurantInfo.name || '';
    const type = restaurantInfo.restaurantType || '';
    const rating = restaurantInfo.rating || 0;
    const priceLevel = restaurantInfo.price_level || 2;
    const address = restaurantInfo.vicinity || restaurantInfo.formatted_address || '';
    const userRatingsTotal = restaurantInfo.user_ratings_total || 0;
    const businessStatus = restaurantInfo.business_status || '';
    const website = restaurantInfo.website || '';
    const phone = restaurantInfo.formatted_phone_number || '';
    const openingHours = restaurantInfo.opening_hours || null;
    const reviews = restaurantInfo.reviews || [];
    const photos = restaurantInfo.photos || [];
    const types = restaurantInfo.types || [];
    const editorialSummary = restaurantInfo.editorial_summary || null;
    
      let query = `餐廳菜單 ${name}`;
    
    if (type && type !== 'unknown') {
      query += ` ${type} 菜系`;
    }
    
    if (types && types.length > 0) {
      const relevantTypes = types.filter(t => 
        ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'bar', 'meal_delivery'].includes(t)
      );
      if (relevantTypes.length > 0) {
        query += ` ${relevantTypes.join(' ')}`;
      }
    }
    
    if (address) {
      query += ` ${address}`;
    }
    
    if (rating > 0) {
      query += ` ${rating}星評分`;
      if (userRatingsTotal > 0) {
        query += ` ${userRatingsTotal}個評論`;
      }
    }
    
    const priceLevels = ['便宜', '中等便宜', '中等', '昂貴', '非常昂貴'];
    if (priceLevels[priceLevel]) {
      query += ` ${priceLevels[priceLevel]}價格`;
    }
    
    if (businessStatus) {
      if (businessStatus === 'OPERATIONAL') {
        query += ' 營業中';
      } else if (businessStatus === 'CLOSED_TEMPORARILY') {
        query += ' 暫時關閉';
      } else if (businessStatus === 'CLOSED_PERMANENTLY') {
        query += ' 永久關閉';
      }
    }
    
    if (editorialSummary && editorialSummary.overview) {
      query += ` ${editorialSummary.overview}`;
    }
    
    if (reviews && reviews.length > 0) {
      const recentReviews = reviews.slice(0, 3); 
      const reviewKeywords = recentReviews.map(review => {
        const text = review.text || '';
        const keywords = this.extractKeywordsFromReview(text);
        return keywords.join(' ');
      }).filter(keywords => keywords.length > 0);
      
      if (reviewKeywords.length > 0) {
        query += ` ${reviewKeywords.join(' ')}`;
      }
    }
    
    console.log('🔍 Comprehensive AI search query built:', query);
    return query;
  }

  // 從評論中提取關鍵詞
  extractKeywordsFromReview(reviewText) {
    const keywords = [];
    const text = reviewText.toLowerCase();
    
    // 食物相關關鍵詞
    const foodKeywords = [
      'pizza', 'pasta', 'sushi', 'burger', 'salad', 'soup', 'steak', 'chicken', 'fish',
      'pizza', '義大利麵', '壽司', '漢堡', '沙拉', '湯', '牛排', '雞肉', '魚',
      'delicious', 'tasty', 'fresh', 'amazing', 'great', 'excellent', 'wonderful',
      '美味', '好吃', '新鮮', '驚人', '很棒', '優秀', '精彩'
    ];
    
    foodKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords.slice(0, 5);
  }

  async performAIMenuSearch(searchQuery, restaurantInfo) {
    
    console.log('🔍 AI Search Query:', searchQuery);
    console.log('📊 Restaurant Info for AI:', {
      name: restaurantInfo.name,
      rating: restaurantInfo.rating,
      priceLevel: restaurantInfo.price_level,
      userRatingsTotal: restaurantInfo.user_ratings_total,
      businessStatus: restaurantInfo.business_status,
      types: restaurantInfo.types,
      reviews: restaurantInfo.reviews?.length || 0,
      photos: restaurantInfo.photos?.length || 0
    });
    
    const restaurantType = restaurantInfo.restaurantType || 'american';
    const baseMenu = this.getBaseMenuForType(restaurantType);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiAdjustedMenu = this.adjustMenuForComprehensiveAISearch(baseMenu, searchQuery, restaurantInfo);
    
    return aiAdjustedMenu;
  }

  adjustMenuForComprehensiveAISearch(baseMenu, searchQuery, restaurantInfo) {
    const adjustedMenu = JSON.parse(JSON.stringify(baseMenu));
    const queryLower = searchQuery.toLowerCase();
    
    const rating = restaurantInfo.rating || 0;
    const userRatingsTotal = restaurantInfo.user_ratings_total || 0;
    const priceLevel = restaurantInfo.price_level || 2;
    const reviews = restaurantInfo.reviews || [];
    
    adjustedMenu.categories.forEach(category => {
      category.items.forEach(item => {
        if (rating >= 4.5) {
          item.description = `AI 推薦：${item.description} (基於${rating}星評分和${userRatingsTotal}個評論)`;
        } else if (rating >= 4.0) {
          item.description = `AI 推薦：${item.description} (高評分餐廳)`;
        } else {
          item.description = `AI 搜尋：${item.description}`;
        }
        
        const priceMultiplier = this.getPriceMultiplier(priceLevel);
        item.price = Math.round((item.basePrice * priceMultiplier) * 100) / 100;
        
        if (reviews.length > 0) {
          const reviewText = reviews.map(r => r.text || '').join(' ').toLowerCase();
          if (reviewText.includes('delicious') || reviewText.includes('美味')) {
            item.description += ' (顧客推薦)';
          }
          if (reviewText.includes('fresh') || reviewText.includes('新鮮')) {
            item.description += ' (新鮮食材)';
          }
        }
        
        if (queryLower.includes('高評分') || queryLower.includes('高評價')) {
          item.description = `⭐ ${item.description}`;
        }
        
        if (queryLower.includes('便宜') || queryLower.includes('經濟')) {
          item.price = Math.round((item.price * 0.8) * 100) / 100;
          item.description += ' (經濟實惠)';
        }
        
        if (queryLower.includes('昂貴') || queryLower.includes('高檔')) {
          item.price = Math.round((item.price * 1.3) * 100) / 100;
          item.description += ' (精緻料理)';
        }
        
        item.aiRecommended = true;
        item.searchContext = this.extractSearchContext(searchQuery, restaurantInfo);
      });
      
      if (userRatingsTotal >= 500) {
        category.items = category.items.slice(0, Math.min(6, category.items.length));
      } else if (userRatingsTotal >= 100) {
        category.items = category.items.slice(0, Math.min(4, category.items.length));
      } else {
        category.items = category.items.slice(0, Math.min(3, category.items.length));
      }
    });
    
    return adjustedMenu;
  }

  extractSearchContext(searchQuery, restaurantInfo) {
    const context = {
      searchQuery: searchQuery,
      restaurantName: restaurantInfo.name,
      rating: restaurantInfo.rating,
      priceLevel: restaurantInfo.price_level,
      userRatingsTotal: restaurantInfo.user_ratings_total,
      businessStatus: restaurantInfo.business_status,
      searchTimestamp: new Date().toISOString()
    };
    
    return context;
  }

  adjustMenuForAISearch(baseMenu, searchQuery, restaurantInfo) {
    const adjustedMenu = JSON.parse(JSON.stringify(baseMenu));
    
    const queryLower = searchQuery.toLowerCase();
    
    adjustedMenu.categories.forEach(category => {
      category.items.forEach(item => {
        if (queryLower.includes('高評分') || queryLower.includes('高評價')) {
          item.description = `AI 推薦：${item.description}`;
        }
        
        const priceMultiplier = this.getPriceMultiplier(restaurantInfo.price_level || 2);
        item.price = Math.round((item.basePrice * priceMultiplier) * 100) / 100;
        
        item.aiRecommended = true;
      });
    });
    
    return adjustedMenu;
  }

  generateDynamicMenuFromRealData(placeId, realPlaceDetails, restaurantInfo = null) {
    const restaurantName = realPlaceDetails.name || 'Unknown Restaurant';
    const restaurantType = this.extractRestaurantTypeFromRealData(realPlaceDetails, restaurantInfo);
    const rating = realPlaceDetails.rating || 0;
    const priceLevel = realPlaceDetails.price_level !== undefined ? realPlaceDetails.price_level : 2;
    const userRatingsTotal = realPlaceDetails.user_ratings_total || 0;
    const businessStatus = realPlaceDetails.business_status || 'OPERATIONAL';
    
    console.log('🍽️ Generating menu from real Google Maps data:', {
      name: restaurantName,
      type: restaurantType,
      rating: rating,
      priceLevel: priceLevel,
      businessStatus: businessStatus,
      placeId: placeId
    });
    
    if (businessStatus !== 'OPERATIONAL') {
      return this.createNoMenuResponse(placeId, `餐廳目前${businessStatus === 'CLOSED_TEMPORARILY' ? '暫時關閉' : '永久關閉'}`);
    }
    
    if (rating < 2.0) {
      return this.createNoMenuResponse(placeId, '餐廳評分過低，無法提供菜單');
    }
    
    const menuData = this.createDynamicMenuData(restaurantName, restaurantType, rating, priceLevel, userRatingsTotal);
    
    return {
      placeId: placeId,
      lastUpdated: new Date().toISOString(),
      categories: menuData.categories,
      currency: "USD",
      availability: "Available",
      source: "Google Maps API + Dynamic Generation",
      restaurantName: restaurantName,
      restaurantType: restaurantType,
      rating: rating,
      priceLevel: priceLevel,
      userRatingsTotal: userRatingsTotal,
      businessStatus: businessStatus,
      realDataBased: true
    };
  }

  extractRestaurantTypeFromRealData(realPlaceDetails, restaurantInfo = null) {

    if (restaurantInfo?.restaurantType) {
      return restaurantInfo.restaurantType;
    }
    

    if (realPlaceDetails.types && realPlaceDetails.types.length > 0) {
      const types = realPlaceDetails.types.map(t => t.toLowerCase());
      const name = (realPlaceDetails.name || '').toLowerCase();
      

      if (types.some(t => t.includes('japanese') || t.includes('sushi'))) return 'japanese';
      if (types.some(t => t.includes('italian') || t.includes('pizza'))) return 'italian';
      if (types.some(t => t.includes('chinese'))) return 'chinese';
      if (types.some(t => t.includes('mexican'))) return 'mexican';
      if (types.some(t => t.includes('thai'))) return 'thai';
      if (types.some(t => t.includes('indian'))) return 'indian';
      if (types.some(t => t.includes('korean'))) return 'korean';
      if (types.some(t => t.includes('french'))) return 'french';
      if (types.some(t => t.includes('seafood'))) return 'seafood';
      if (types.some(t => t.includes('cafe') || t.includes('bakery'))) return 'cafe';
      if (types.some(t => t.includes('meal_takeaway') || t.includes('fast_food'))) return 'fast_food';
    }
    

    if (realPlaceDetails.name) {
      return this.guessRestaurantTypeFromName(realPlaceDetails.name);
    }
    
    return 'american'; 
  }


  generateDynamicMenu(placeId, restaurantInfo = null) {

    const restaurantName = restaurantInfo?.name || 'Restaurant';
    const restaurantType = this.extractRestaurantType(placeId, restaurantInfo);
    const rating = restaurantInfo?.rating || 4.0;
    const priceLevel = restaurantInfo?.price_level || 2;
    const userRatingsTotal = restaurantInfo?.user_ratings_total || 100;
    
    console.log('🍽️ Generating dynamic menu for:', {
      name: restaurantName,
      type: restaurantType,
      rating: rating,
      priceLevel: priceLevel,
      placeId: placeId
    });
    

    const menuData = this.createDynamicMenuData(restaurantName, restaurantType, rating, priceLevel, userRatingsTotal);
    
    return {
      placeId: placeId,
      lastUpdated: new Date().toISOString(),
      categories: menuData.categories,
      currency: "USD",
      availability: "Available",
      source: "Dynamic Generation",
      restaurantName: restaurantName,
      restaurantType: restaurantType,
      rating: rating,
      priceLevel: priceLevel,
      userRatingsTotal: userRatingsTotal
    };
  }


  extractRestaurantType(placeId, restaurantInfo) {

    if (restaurantInfo?.restaurantType) {
      return restaurantInfo.restaurantType;
    }
    

    if (placeId.includes('_')) {
      const parts = placeId.split('_');
      if (parts.length >= 2) {
        return parts[0]; 
      }
    }
    

    if (restaurantInfo?.name) {
      return this.guessRestaurantTypeFromName(restaurantInfo.name);
    }
    
    return 'american'; 
  }


  guessRestaurantTypeFromName(name) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('sushi') || nameLower.includes('japanese') || nameLower.includes('ramen')) {
      return 'japanese';
    }
    if (nameLower.includes('pizza') || nameLower.includes('italian') || nameLower.includes('pasta')) {
      return 'italian';
    }
    if (nameLower.includes('chinese') || nameLower.includes('dim sum') || nameLower.includes('wok')) {
      return 'chinese';
    }
    if (nameLower.includes('mexican') || nameLower.includes('taco') || nameLower.includes('burrito')) {
      return 'mexican';
    }
    if (nameLower.includes('thai') || nameLower.includes('pad thai') || nameLower.includes('curry')) {
      return 'thai';
    }
    if (nameLower.includes('indian') || nameLower.includes('curry') || nameLower.includes('biryani')) {
      return 'indian';
    }
    if (nameLower.includes('korean') || nameLower.includes('bbq') || nameLower.includes('kimchi')) {
      return 'korean';
    }
    if (nameLower.includes('french') || nameLower.includes('bistro') || nameLower.includes('cafe')) {
      return 'french';
    }
    if (nameLower.includes('seafood') || nameLower.includes('fish') || nameLower.includes('ocean')) {
      return 'seafood';
    }
    if (nameLower.includes('coffee') || nameLower.includes('cafe') || nameLower.includes('bakery')) {
      return 'cafe';
    }
    if (nameLower.includes('burger') || nameLower.includes('fast') || nameLower.includes('quick')) {
      return 'fast_food';
    }
    
    return 'american';
  }


  createDynamicMenuData(restaurantName, restaurantType, rating, priceLevel, userRatingsTotal) {
    const baseMenu = this.getBaseMenuForType(restaurantType);
    const adjustedMenu = this.adjustMenuForRestaurant(baseMenu, restaurantName, rating, priceLevel, userRatingsTotal);
    
    return adjustedMenu;
  }


  getBaseMenuForType(restaurantType) {
    const baseMenus = {
      'japanese': {
        categories: [
          {
            name: "Sushi & Sashimi",
            items: [
              { name: "Salmon Sashimi", basePrice: 12.99, description: "Fresh salmon slices" },
              { name: "Tuna Roll", basePrice: 8.99, description: "Tuna roll with cucumber" },
              { name: "California Roll", basePrice: 9.99, description: "Crab, avocado, and cucumber" },
              { name: "Dragon Roll", basePrice: 14.99, description: "Eel and cucumber roll" }
            ]
          },
          {
            name: "Ramen",
            items: [
              { name: "Tonkotsu Ramen", basePrice: 13.99, description: "Pork bone broth ramen" },
              { name: "Miso Ramen", basePrice: 12.99, description: "Miso-based ramen soup" },
              { name: "Shoyu Ramen", basePrice: 11.99, description: "Soy sauce based ramen" }
            ]
          },
          {
            name: "Teriyaki & Grilled",
            items: [
              { name: "Chicken Teriyaki", basePrice: 14.99, description: "Grilled chicken with teriyaki sauce" },
              { name: "Beef Teriyaki", basePrice: 16.99, description: "Grilled beef with teriyaki sauce" },
              { name: "Salmon Teriyaki", basePrice: 15.99, description: "Grilled salmon with teriyaki sauce" }
            ]
          }
        ]
      },
      'italian': {
        categories: [
          {
            name: "Antipasti",
            items: [
              { name: "Bruschetta", basePrice: 8.99, description: "Toasted bread with tomatoes and basil" },
              { name: "Caprese Salad", basePrice: 11.99, description: "Fresh mozzarella with tomatoes and basil" },
              { name: "Prosciutto e Melone", basePrice: 13.99, description: "Cured ham with cantaloupe" }
            ]
          },
          {
            name: "Pasta",
            items: [
              { name: "Spaghetti Carbonara", basePrice: 16.99, description: "Classic Roman pasta with eggs and pancetta" },
              { name: "Fettuccine Alfredo", basePrice: 15.99, description: "Creamy fettuccine with parmesan cheese" },
              { name: "Lasagna", basePrice: 18.99, description: "Layered pasta with meat sauce and cheese" }
            ]
          },
          {
            name: "Pizza",
            items: [
              { name: "Margherita", basePrice: 14.99, description: "Tomato, mozzarella, and fresh basil" },
              { name: "Quattro Stagioni", basePrice: 17.99, description: "Four seasons pizza with seasonal toppings" },
              { name: "Diavola", basePrice: 16.99, description: "Spicy salami and mozzarella" }
            ]
          }
        ]
      },
      'chinese': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Spring Rolls", basePrice: 6.99, description: "Crispy vegetable spring rolls" },
              { name: "Dumplings", basePrice: 8.99, description: "Steamed pork dumplings" },
              { name: "Hot & Sour Soup", basePrice: 4.99, description: "Traditional Chinese soup" }
            ]
          },
          {
            name: "Main Dishes",
            items: [
              { name: "Kung Pao Chicken", basePrice: 13.99, description: "Spicy chicken with peanuts" },
              { name: "Sweet and Sour Pork", basePrice: 12.99, description: "Battered pork with sweet sauce" },
              { name: "Beef with Broccoli", basePrice: 14.99, description: "Tender beef with fresh broccoli" }
            ]
          },
          {
            name: "Rice & Noodles",
            items: [
              { name: "Fried Rice", basePrice: 9.99, description: "Wok-fried rice with vegetables" },
              { name: "Lo Mein", basePrice: 10.99, description: "Soft noodles with vegetables" },
              { name: "Chow Mein", basePrice: 11.99, description: "Crispy noodles with vegetables" }
            ]
          }
        ]
      },
      'mexican': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Guacamole", basePrice: 7.99, description: "Fresh avocado dip with chips" },
              { name: "Quesadillas", basePrice: 9.99, description: "Grilled cheese tortillas" },
              { name: "Nachos", basePrice: 8.99, description: "Tortilla chips with cheese and jalapeños" }
            ]
          },
          {
            name: "Tacos",
            items: [
              { name: "Carnitas Tacos", basePrice: 11.99, description: "Slow-cooked pork tacos" },
              { name: "Fish Tacos", basePrice: 12.99, description: "Grilled fish with cabbage slaw" },
              { name: "Veggie Tacos", basePrice: 9.99, description: "Grilled vegetables with beans" }
            ]
          },
          {
            name: "Burritos",
            items: [
              { name: "Chicken Burrito", basePrice: 13.99, description: "Grilled chicken with rice and beans" },
              { name: "Beef Burrito", basePrice: 14.99, description: "Seasoned beef with rice and beans" },
              { name: "Veggie Burrito", basePrice: 11.99, description: "Grilled vegetables with rice and beans" }
            ]
          }
        ]
      },
      'thai': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Spring Rolls", basePrice: 6.99, description: "Fresh vegetable spring rolls with sweet chili sauce" },
              { name: "Tom Yum Soup", basePrice: 8.99, description: "Spicy and sour soup with shrimp" },
              { name: "Satay Skewers", basePrice: 9.99, description: "Grilled chicken skewers with peanut sauce" }
            ]
          },
          {
            name: "Curries",
            items: [
              { name: "Green Curry", basePrice: 13.99, description: "Spicy green curry with chicken and vegetables" },
              { name: "Red Curry", basePrice: 13.99, description: "Medium spicy red curry with beef" },
              { name: "Massaman Curry", basePrice: 14.99, description: "Mild curry with potatoes and peanuts" }
            ]
          },
          {
            name: "Noodles",
            items: [
              { name: "Pad Thai", basePrice: 12.99, description: "Stir-fried rice noodles with shrimp and tofu" },
              { name: "Pad See Ew", basePrice: 11.99, description: "Wide rice noodles with Chinese broccoli" },
              { name: "Drunken Noodles", basePrice: 13.99, description: "Spicy stir-fried noodles with basil" }
            ]
          }
        ]
      },
      'indian': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Samosas", basePrice: 5.99, description: "Crispy pastries filled with spiced potatoes" },
              { name: "Chicken Tikka", basePrice: 8.99, description: "Tandoori grilled chicken pieces" },
              { name: "Pakoras", basePrice: 6.99, description: "Deep-fried vegetable fritters" }
            ]
          },
          {
            name: "Curries",
            items: [
              { name: "Butter Chicken", basePrice: 15.99, description: "Creamy tomato curry with tender chicken" },
              { name: "Lamb Vindaloo", basePrice: 16.99, description: "Spicy lamb curry with potatoes" },
              { name: "Chana Masala", basePrice: 12.99, description: "Spiced chickpea curry" }
            ]
          },
          {
            name: "Biryani & Rice",
            items: [
              { name: "Chicken Biryani", basePrice: 14.99, description: "Fragrant basmati rice with spiced chicken" },
              { name: "Vegetable Biryani", basePrice: 12.99, description: "Mixed vegetable biryani" },
              { name: "Basmati Rice", basePrice: 3.99, description: "Steamed basmati rice" }
            ]
          }
        ]
      },
      'korean': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Kimchi", basePrice: 4.99, description: "Fermented spicy cabbage" },
              { name: "Korean Pancakes", basePrice: 8.99, description: "Savory pancakes with vegetables" },
              { name: "Mandu", basePrice: 7.99, description: "Korean dumplings with dipping sauce" }
            ]
          },
          {
            name: "BBQ",
            items: [
              { name: "Bulgogi", basePrice: 16.99, description: "Marinated beef grilled to perfection" },
              { name: "Galbi", basePrice: 18.99, description: "Korean-style short ribs" },
              { name: "Chicken Bulgogi", basePrice: 14.99, description: "Marinated chicken with vegetables" }
            ]
          },
          {
            name: "Stews & Soups",
            items: [
              { name: "Kimchi Jjigae", basePrice: 12.99, description: "Spicy kimchi stew with pork" },
              { name: "Doenjang Jjigae", basePrice: 11.99, description: "Fermented soybean paste stew" },
              { name: "Samgyetang", basePrice: 15.99, description: "Ginseng chicken soup" }
            ]
          }
        ]
      },
      'french': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Escargot", basePrice: 12.99, description: "Snails in garlic butter" },
              { name: "French Onion Soup", basePrice: 8.99, description: "Classic soup with melted cheese" },
              { name: "Pâté", basePrice: 9.99, description: "Duck liver pâté with toast" }
            ]
          },
          {
            name: "Main Courses",
            items: [
              { name: "Coq au Vin", basePrice: 22.99, description: "Chicken braised in red wine" },
              { name: "Bouillabaisse", basePrice: 24.99, description: "Traditional fish stew" },
              { name: "Duck Confit", basePrice: 26.99, description: "Slow-cooked duck leg" }
            ]
          },
          {
            name: "Desserts",
            items: [
              { name: "Crème Brûlée", basePrice: 7.99, description: "Vanilla custard with caramelized sugar" },
              { name: "Tarte Tatin", basePrice: 8.99, description: "Upside-down apple tart" },
              { name: "Profiteroles", basePrice: 9.99, description: "Cream puffs with chocolate sauce" }
            ]
          }
        ]
      },
      'seafood': {
        categories: [
          {
            name: "Raw Bar",
            items: [
              { name: "Oysters", basePrice: 2.99, description: "Fresh oysters on the half shell" },
              { name: "Crab Cakes", basePrice: 14.99, description: "Pan-seared crab cakes with remoulade" },
              { name: "Shrimp Cocktail", basePrice: 12.99, description: "Jumbo shrimp with cocktail sauce" }
            ]
          },
          {
            name: "Grilled Seafood",
            items: [
              { name: "Grilled Salmon", basePrice: 19.99, description: "Atlantic salmon with lemon herb butter" },
              { name: "Lobster Tail", basePrice: 28.99, description: "Maine lobster tail with drawn butter" },
              { name: "Swordfish Steak", basePrice: 22.99, description: "Grilled swordfish with capers" }
            ]
          },
          {
            name: "Seafood Pasta",
            items: [
              { name: "Lobster Ravioli", basePrice: 24.99, description: "Homemade ravioli with lobster cream sauce" },
              { name: "Seafood Linguine", basePrice: 21.99, description: "Mixed seafood with white wine sauce" },
              { name: "Shrimp Scampi", basePrice: 18.99, description: "Shrimp in garlic white wine sauce" }
            ]
          }
        ]
      },
      'cafe': {
        categories: [
          {
            name: "Coffee",
            items: [
              { name: "Espresso", basePrice: 2.99, description: "Single shot of espresso" },
              { name: "Cappuccino", basePrice: 4.99, description: "Espresso with steamed milk foam" },
              { name: "Latte", basePrice: 5.99, description: "Espresso with steamed milk" }
            ]
          },
          {
            name: "Pastries",
            items: [
              { name: "Croissant", basePrice: 3.99, description: "Buttery French croissant" },
              { name: "Muffin", basePrice: 2.99, description: "Fresh baked muffin of the day" },
              { name: "Danish", basePrice: 3.99, description: "Fruit-filled Danish pastry" }
            ]
          },
          {
            name: "Light Meals",
            items: [
              { name: "Avocado Toast", basePrice: 8.99, description: "Smashed avocado on sourdough" },
              { name: "Quiche", basePrice: 9.99, description: "Daily quiche with side salad" },
              { name: "Soup & Sandwich", basePrice: 11.99, description: "Soup of the day with grilled sandwich" }
            ]
          }
        ]
      },
      'fast_food': {
        categories: [
          {
            name: "Burgers",
            items: [
              { name: "Classic Burger", basePrice: 6.99, description: "Beef patty with lettuce, tomato, onion" },
              { name: "Cheeseburger", basePrice: 7.99, description: "Classic burger with cheese" },
              { name: "Chicken Burger", basePrice: 6.99, description: "Grilled chicken breast burger" }
            ]
          },
          {
            name: "Fries & Sides",
            items: [
              { name: "French Fries", basePrice: 2.99, description: "Crispy golden fries" },
              { name: "Onion Rings", basePrice: 3.99, description: "Beer-battered onion rings" },
              { name: "Chicken Nuggets", basePrice: 4.99, description: "6-piece chicken nuggets" }
            ]
          },
          {
            name: "Drinks",
            items: [
              { name: "Soft Drink", basePrice: 1.99, description: "Coke, Sprite, or Fanta" },
              { name: "Milkshake", basePrice: 3.99, description: "Vanilla, chocolate, or strawberry" },
              { name: "Coffee", basePrice: 1.99, description: "Fresh brewed coffee" }
            ]
          }
        ]
      },
      'american': {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Caesar Salad", basePrice: 12.99, description: "Fresh romaine lettuce with caesar dressing" },
              { name: "Buffalo Wings", basePrice: 9.99, description: "Spicy chicken wings with blue cheese dip" },
              { name: "Mozzarella Sticks", basePrice: 8.99, description: "Crispy mozzarella with marinara sauce" }
            ]
          },
          {
            name: "Main Courses",
            items: [
              { name: "Grilled Salmon", basePrice: 24.99, description: "Fresh Atlantic salmon with lemon butter sauce" },
              { name: "Ribeye Steak", basePrice: 32.99, description: "12oz ribeye steak cooked to perfection" },
              { name: "Chicken Parmesan", basePrice: 18.99, description: "Breaded chicken breast with marinara and mozzarella" }
            ]
          },
          {
            name: "Desserts",
            items: [
              { name: "Chocolate Cake", basePrice: 7.99, description: "Rich chocolate cake with vanilla ice cream" },
              { name: "Tiramisu", basePrice: 8.99, description: "Classic Italian dessert" },
              { name: "Cheesecake", basePrice: 6.99, description: "New York style cheesecake" }
            ]
          }
        ]
      }
    };
    
    return baseMenus[restaurantType] || baseMenus['american'];
  }

  
  adjustMenuForRestaurant(baseMenu, restaurantName, rating, priceLevel, userRatingsTotal) {
    const adjustedMenu = JSON.parse(JSON.stringify(baseMenu)); // 深拷貝
    
    
    const ratingMultiplier = this.getRatingMultiplier(rating);
    
    
    const priceMultiplier = this.getPriceMultiplier(priceLevel);
    
    
    const menuVariety = this.getMenuVariety(rating, userRatingsTotal);
    
    adjustedMenu.categories.forEach(category => {
      category.items.forEach(item => {
        
        item.price = Math.round((item.basePrice * priceMultiplier * ratingMultiplier) * 100) / 100;
        
        
        if (rating >= 4.5) {
          item.description = this.enhanceDescription(item.description, 'premium');
        } else if (rating >= 4.0) {
          item.description = this.enhanceDescription(item.description, 'quality');
        }
        
        
        item.name = this.personalizeItemName(item.name, restaurantName, category.name);
      });
      
      
      if (menuVariety === 'limited') {
        category.items = category.items.slice(0, Math.max(2, Math.floor(category.items.length * 0.7)));
      } else if (menuVariety === 'extensive') {
        
        category.items = category.items.slice(0, Math.min(6, category.items.length));
      }
    });
    
    return adjustedMenu;
  }

  
  getRatingMultiplier(rating) {
    if (rating >= 4.5) return 1.2; 
    if (rating >= 4.0) return 1.1;
    if (rating >= 3.5) return 1.0;
    if (rating >= 3.0) return 0.9;
    return 0.8; 
  }


  getPriceMultiplier(priceLevel) {
    switch (priceLevel) {
      case 0: return 0.7; 
      case 1: return 0.85; 
      case 2: return 1.0; 
      case 3: return 1.2; 
      case 4: return 1.5; 
      default: return 1.0;
    }
  }

  
  getMenuVariety(rating, userRatingsTotal) {
    if (rating >= 4.5 && userRatingsTotal >= 500) return 'extensive';
    if (rating >= 4.0 && userRatingsTotal >= 200) return 'standard';
    return 'limited';
  }

  
  enhanceDescription(description, type) {
    const enhancements = {
      'premium': ['premium', 'artisanal', 'handcrafted', 'gourmet', 'signature'],
      'quality': ['fresh', 'quality', 'carefully prepared', 'delicious']
    };
    
    const enhancement = enhancements[type] || [];
    if (enhancement.length > 0) {
      const randomEnhancement = enhancement[Math.floor(Math.random() * enhancement.length)];
      return `${randomEnhancement} ${description}`;
    }
    
    return description;
  }

    
  personalizeItemName(itemName, restaurantName, categoryName) {
  
    const nameWords = restaurantName.toLowerCase().split(' ');
    
    
    if (categoryName === 'Main Courses' || categoryName === 'Main Dishes') {
      const randomWord = nameWords[Math.floor(Math.random() * nameWords.length)];
      if (randomWord && randomWord.length > 3) {
        return `${itemName} (${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)} Style)`;
      }
    }
    
    return itemName;
  }

  
  generateMockMenu(placeId) {
    
    const restaurantMenus = {
      
      'american_restaurant_1': {
        name: "American Bistro",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Caesar Salad", price: 12.99, description: "Fresh romaine lettuce with caesar dressing" },
              { name: "Buffalo Wings", price: 9.99, description: "Spicy chicken wings with blue cheese dip" },
              { name: "Mozzarella Sticks", price: 8.99, description: "Crispy mozzarella with marinara sauce" }
            ]
          },
          {
            name: "Main Courses",
            items: [
              { name: "Grilled Salmon", price: 24.99, description: "Fresh Atlantic salmon with lemon butter sauce" },
              { name: "Ribeye Steak", price: 32.99, description: "12oz ribeye steak cooked to perfection" },
              { name: "Chicken Parmesan", price: 18.99, description: "Breaded chicken breast with marinara and mozzarella" }
            ]
          },
          {
            name: "Desserts",
            items: [
              { name: "Chocolate Cake", price: 7.99, description: "Rich chocolate cake with vanilla ice cream" },
              { name: "Tiramisu", price: 8.99, description: "Classic Italian dessert" },
              { name: "Cheesecake", price: 6.99, description: "New York style cheesecake" }
            ]
          }
        ]
      },
      
      'italian_restaurant_1': {
        name: "Bella Italia",
        categories: [
          {
            name: "Antipasti",
            items: [
              { name: "Bruschetta", price: 8.99, description: "Toasted bread with tomatoes and basil" },
              { name: "Caprese Salad", price: 11.99, description: "Fresh mozzarella with tomatoes and basil" },
              { name: "Prosciutto e Melone", price: 13.99, description: "Cured ham with cantaloupe" }
            ]
          },
          {
            name: "Pasta",
            items: [
              { name: "Spaghetti Carbonara", price: 16.99, description: "Classic Roman pasta with eggs and pancetta" },
              { name: "Fettuccine Alfredo", price: 15.99, description: "Creamy fettuccine with parmesan cheese" },
              { name: "Lasagna", price: 18.99, description: "Layered pasta with meat sauce and cheese" }
            ]
          },
          {
            name: "Pizza",
            items: [
              { name: "Margherita", price: 14.99, description: "Tomato, mozzarella, and fresh basil" },
              { name: "Quattro Stagioni", price: 17.99, description: "Four seasons pizza with seasonal toppings" },
              { name: "Diavola", price: 16.99, description: "Spicy salami and mozzarella" }
            ]
          }
        ]
      },
      
      'japanese_restaurant_1': {
        name: "Sakura Sushi",
        categories: [
          {
            name: "Sushi",
            items: [
              { name: "Salmon Sashimi", price: 12.99, description: "Fresh salmon slices" },
              { name: "Tuna Roll", price: 8.99, description: "Tuna roll with cucumber" },
              { name: "California Roll", price: 9.99, description: "Crab, avocado, and cucumber" }
            ]
          },
          {
            name: "Ramen",
            items: [
              { name: "Tonkotsu Ramen", price: 13.99, description: "Pork bone broth ramen" },
              { name: "Miso Ramen", price: 12.99, description: "Miso-based ramen soup" },
              { name: "Shoyu Ramen", price: 11.99, description: "Soy sauce based ramen" }
            ]
          },
          {
            name: "Teriyaki",
            items: [
              { name: "Chicken Teriyaki", price: 14.99, description: "Grilled chicken with teriyaki sauce" },
              { name: "Beef Teriyaki", price: 16.99, description: "Grilled beef with teriyaki sauce" },
              { name: "Salmon Teriyaki", price: 15.99, description: "Grilled salmon with teriyaki sauce" }
            ]
          }
        ]
      },
      
      'chinese_restaurant_1': {
        name: "Golden Dragon",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Spring Rolls", price: 6.99, description: "Crispy vegetable spring rolls" },
              { name: "Dumplings", price: 8.99, description: "Steamed pork dumplings" },
              { name: "Hot & Sour Soup", price: 4.99, description: "Traditional Chinese soup" }
            ]
          },
          {
            name: "Main Dishes",
            items: [
              { name: "Kung Pao Chicken", price: 13.99, description: "Spicy chicken with peanuts" },
              { name: "Sweet and Sour Pork", price: 12.99, description: "Battered pork with sweet sauce" },
              { name: "Beef with Broccoli", price: 14.99, description: "Tender beef with fresh broccoli" }
            ]
          },
          {
            name: "Rice & Noodles",
            items: [
              { name: "Fried Rice", price: 9.99, description: "Wok-fried rice with vegetables" },
              { name: "Lo Mein", price: 10.99, description: "Soft noodles with vegetables" },
              { name: "Chow Mein", price: 11.99, description: "Crispy noodles with vegetables" }
            ]
          }
        ]
      },
      
      'mexican_restaurant_1': {
        name: "El Mariachi",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Guacamole", price: 7.99, description: "Fresh avocado dip with chips" },
              { name: "Quesadillas", price: 9.99, description: "Grilled cheese tortillas" },
              { name: "Nachos", price: 8.99, description: "Tortilla chips with cheese and jalapeños" }
            ]
          },
          {
            name: "Tacos",
            items: [
              { name: "Carnitas Tacos", price: 11.99, description: "Slow-cooked pork tacos" },
              { name: "Fish Tacos", price: 12.99, description: "Grilled fish with cabbage slaw" },
              { name: "Veggie Tacos", price: 9.99, description: "Grilled vegetables with beans" }
            ]
          },
          {
            name: "Burritos",
            items: [
              { name: "Chicken Burrito", price: 13.99, description: "Grilled chicken with rice and beans" },
              { name: "Beef Burrito", price: 14.99, description: "Seasoned beef with rice and beans" },
              { name: "Veggie Burrito", price: 11.99, description: "Grilled vegetables with rice and beans" }
            ]
          }
        ]
      },
      
      'thai_restaurant_1': {
        name: "Bangkok Garden",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Spring Rolls", price: 6.99, description: "Fresh vegetable spring rolls with sweet chili sauce" },
              { name: "Tom Yum Soup", price: 8.99, description: "Spicy and sour soup with shrimp" },
              { name: "Satay Skewers", price: 9.99, description: "Grilled chicken skewers with peanut sauce" }
            ]
          },
          {
            name: "Curries",
            items: [
              { name: "Green Curry", price: 13.99, description: "Spicy green curry with chicken and vegetables" },
              { name: "Red Curry", price: 13.99, description: "Medium spicy red curry with beef" },
              { name: "Massaman Curry", price: 14.99, description: "Mild curry with potatoes and peanuts" }
            ]
          },
          {
            name: "Noodles",
            items: [
              { name: "Pad Thai", price: 12.99, description: "Stir-fried rice noodles with shrimp and tofu" },
              { name: "Pad See Ew", price: 11.99, description: "Wide rice noodles with Chinese broccoli" },
              { name: "Drunken Noodles", price: 13.99, description: "Spicy stir-fried noodles with basil" }
            ]
          }
        ]
      },

      'indian_restaurant_1': {
        name: "Spice Palace",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Samosas", price: 5.99, description: "Crispy pastries filled with spiced potatoes" },
              { name: "Chicken Tikka", price: 8.99, description: "Tandoori grilled chicken pieces" },
              { name: "Pakoras", price: 6.99, description: "Deep-fried vegetable fritters" }
            ]
          },
          {
            name: "Curries",
            items: [
              { name: "Butter Chicken", price: 15.99, description: "Creamy tomato curry with tender chicken" },
              { name: "Lamb Vindaloo", price: 16.99, description: "Spicy lamb curry with potatoes" },
              { name: "Chana Masala", price: 12.99, description: "Spiced chickpea curry" }
            ]
          },
          {
            name: "Biryani & Rice",
            items: [
              { name: "Chicken Biryani", price: 14.99, description: "Fragrant basmati rice with spiced chicken" },
              { name: "Vegetable Biryani", price: 12.99, description: "Mixed vegetable biryani" },
              { name: "Basmati Rice", price: 3.99, description: "Steamed basmati rice" }
            ]
          }
        ]
      },
      // 韓式餐廳
      'korean_restaurant_1': {
        name: "Seoul Kitchen",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Kimchi", price: 4.99, description: "Fermented spicy cabbage" },
              { name: "Korean Pancakes", price: 8.99, description: "Savory pancakes with vegetables" },
              { name: "Mandu", price: 7.99, description: "Korean dumplings with dipping sauce" }
            ]
          },
          {
            name: "BBQ",
            items: [
              { name: "Bulgogi", price: 16.99, description: "Marinated beef grilled to perfection" },
              { name: "Galbi", price: 18.99, description: "Korean-style short ribs" },
              { name: "Chicken Bulgogi", price: 14.99, description: "Marinated chicken with vegetables" }
            ]
          },
          {
            name: "Stews & Soups",
            items: [
              { name: "Kimchi Jjigae", price: 12.99, description: "Spicy kimchi stew with pork" },
              { name: "Doenjang Jjigae", price: 11.99, description: "Fermented soybean paste stew" },
              { name: "Samgyetang", price: 15.99, description: "Ginseng chicken soup" }
            ]
          }
        ]
      },
    
      'french_restaurant_1': {
        name: "Le Bistro",
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Escargot", price: 12.99, description: "Snails in garlic butter" },
              { name: "French Onion Soup", price: 8.99, description: "Classic soup with melted cheese" },
              { name: "Pâté", price: 9.99, description: "Duck liver pâté with toast" }
            ]
          },
          {
            name: "Main Courses",
            items: [
              { name: "Coq au Vin", price: 22.99, description: "Chicken braised in red wine" },
              { name: "Bouillabaisse", price: 24.99, description: "Traditional fish stew" },
              { name: "Duck Confit", price: 26.99, description: "Slow-cooked duck leg" }
            ]
          },
          {
            name: "Desserts",
            items: [
              { name: "Crème Brûlée", price: 7.99, description: "Vanilla custard with caramelized sugar" },
              { name: "Tarte Tatin", price: 8.99, description: "Upside-down apple tart" },
              { name: "Profiteroles", price: 9.99, description: "Cream puffs with chocolate sauce" }
            ]
          }
        ]
      },

      'seafood_restaurant_1': {
        name: "Ocean's Bounty",
        categories: [
          {
            name: "Raw Bar",
            items: [
              { name: "Oysters", price: 2.99, description: "Fresh oysters on the half shell" },
              { name: "Crab Cakes", price: 14.99, description: "Pan-seared crab cakes with remoulade" },
              { name: "Shrimp Cocktail", price: 12.99, description: "Jumbo shrimp with cocktail sauce" }
            ]
          },
          {
            name: "Grilled Seafood",
            items: [
              { name: "Grilled Salmon", price: 19.99, description: "Atlantic salmon with lemon herb butter" },
              { name: "Lobster Tail", price: 28.99, description: "Maine lobster tail with drawn butter" },
              { name: "Swordfish Steak", price: 22.99, description: "Grilled swordfish with capers" }
            ]
          },
          {
            name: "Seafood Pasta",
            items: [
              { name: "Lobster Ravioli", price: 24.99, description: "Homemade ravioli with lobster cream sauce" },
              { name: "Seafood Linguine", price: 21.99, description: "Mixed seafood with white wine sauce" },
              { name: "Shrimp Scampi", price: 18.99, description: "Shrimp in garlic white wine sauce" }
            ]
          }
        ]
      },

      'cafe_restaurant_1': {
        name: "Artisan Coffee",
        categories: [
          {
            name: "Coffee",
            items: [
              { name: "Espresso", price: 2.99, description: "Single shot of espresso" },
              { name: "Cappuccino", price: 4.99, description: "Espresso with steamed milk foam" },
              { name: "Latte", price: 5.99, description: "Espresso with steamed milk" }
            ]
          },
          {
            name: "Pastries",
            items: [
              { name: "Croissant", price: 3.99, description: "Buttery French croissant" },
              { name: "Muffin", price: 2.99, description: "Fresh baked muffin of the day" },
              { name: "Danish", price: 3.99, description: "Fruit-filled Danish pastry" }
            ]
          },
          {
            name: "Light Meals",
            items: [
              { name: "Avocado Toast", price: 8.99, description: "Smashed avocado on sourdough" },
              { name: "Quiche", price: 9.99, description: "Daily quiche with side salad" },
              { name: "Soup & Sandwich", price: 11.99, description: "Soup of the day with grilled sandwich" }
            ]
          }
        ]
      },

      'fast_food_restaurant_1': {
        name: "Quick Bites",
        categories: [
          {
            name: "Burgers",
            items: [
              { name: "Classic Burger", price: 6.99, description: "Beef patty with lettuce, tomato, onion" },
              { name: "Cheeseburger", price: 7.99, description: "Classic burger with cheese" },
              { name: "Chicken Burger", price: 6.99, description: "Grilled chicken breast burger" }
            ]
          },
          {
            name: "Fries & Sides",
            items: [
              { name: "French Fries", price: 2.99, description: "Crispy golden fries" },
              { name: "Onion Rings", price: 3.99, description: "Beer-battered onion rings" },
              { name: "Chicken Nuggets", price: 4.99, description: "6-piece chicken nuggets" }
            ]
          },
          {
            name: "Drinks",
            items: [
              { name: "Soft Drink", price: 1.99, description: "Coke, Sprite, or Fanta" },
              { name: "Milkshake", price: 3.99, description: "Vanilla, chocolate, or strawberry" },
              { name: "Coffee", price: 1.99, description: "Fresh brewed coffee" }
            ]
          }
        ]
      }
    };


    const basePlaceId = placeId.includes('_') ? placeId.split('_').slice(0, -1).join('_') : placeId;
    const menuData = restaurantMenus[basePlaceId] || restaurantMenus['american_restaurant_1'];
    
    return {
      placeId: placeId,
      lastUpdated: new Date().toISOString(),
      categories: menuData.categories,
      currency: "USD",
      availability: "Available",
      source: "Mock Data",
      restaurantName: menuData.name,

      restaurantType: basePlaceId.replace('_restaurant_1', '')
    };
  }


  async searchMenuItems(placeId, searchQuery) {
    try {
      const menu = await this.getRestaurantMenu(placeId);
      if (!menu) return [];

      const results = [];
      menu.categories.forEach(category => {
        category.items.forEach(item => {
          if (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              ...item,
              category: category.name
            });
          }
        });
      });

      return results;
    } catch (error) {
      console.error('Failed to search menu items:', error);
      return [];
    }
  }
}

export default new GoogleMapsService();
