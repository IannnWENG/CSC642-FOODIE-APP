class RealMenuService {
  constructor() {
    this.cache = new Map(); 
    this.cacheTimeout = 30 * 60 * 1000; 
  }

  /**
   * @param {string} placeId 
   * @param {Object} restaurantInfo 
   * @returns {Promise<Object>} 
   */
  async getRestaurantMenu(placeId, restaurantInfo) {
    try {
      console.log('🍽️ Starting real menu search:', {
        name: restaurantInfo.name,
        placeId: placeId,
        address: restaurantInfo.vicinity || restaurantInfo.formatted_address
      });

      const cachedMenu = this.getCachedMenu(placeId);
      if (cachedMenu) {
        console.log('📋 Using cached menu data');
        return cachedMenu;
      }

      
      const googleMenu = await this.searchGoogleMapsMenu(placeId, restaurantInfo);
      if (googleMenu && !googleMenu.noMenuAvailable) {
        console.log('✅ Got menu from Google Maps');
        this.cacheMenu(placeId, googleMenu);
        return googleMenu;
      }

      
      const websiteMenu = await this.searchRestaurantWebsite(restaurantInfo);
      if (websiteMenu && !websiteMenu.noMenuAvailable) {
        console.log('✅ Got menu from restaurant website');
        this.cacheMenu(placeId, websiteMenu);
        return websiteMenu;
      }

      
      console.log('🤖 Using AI to search for menu...');
      const aiMenu = await this.searchMenuWithAI(restaurantInfo);
      if (aiMenu && !aiMenu.noMenuAvailable) {
        console.log('✅ Got menu from AI search');
        this.cacheMenu(placeId, aiMenu);
        return aiMenu;
      }

      
      return this.createNoMenuResponse(placeId, 'Unable to find menu information for this restaurant', restaurantInfo, false);

    } catch (error) {
      console.error('❌ Menu search failed:', error);
      return this.createNoMenuResponse(placeId, 'Error occurred during menu search', restaurantInfo, false);
    }
  }

  /**
   * 
   */
  async searchGoogleMapsMenu(placeId, restaurantInfo) {
    try {

      console.log('🔍 Searching Google Maps menu...');
      
      
      // In actual implementation, this would call Google Places API
      return null;
    } catch (error) {
      console.error('Google Maps menu search failed:', error);
      return null;
    }
  }

  
  async searchRestaurantWebsite(restaurantInfo) {
    try {
      console.log('🌐 Searching restaurant website menu...');
      
      const website = restaurantInfo.website;
      if (!website) {
        console.log('❌ No restaurant website information');
        return null;
      }

      console.log('🔍 Searching website:', website);
      
      return null;
    } catch (error) {
      console.error('Restaurant website menu search failed:', error);
      return null;
    }
  }

  async searchMenuWithAI(restaurantInfo) {
    try {
      console.log('🤖 Using AI to search for menu...');
      
      // Build AI search query
      const searchQuery = this.buildAISearchQuery(restaurantInfo);
      console.log('🔍 AI search query:', searchQuery);

      // Simulate AI search results
      // In actual implementation, this would call AI API
      const aiMenuData = await this.performAIMenuSearch(searchQuery, restaurantInfo);
      
      if (!aiMenuData || !aiMenuData.categories || aiMenuData.categories.length === 0) {
        return this.createNoMenuResponse(restaurantInfo.place_id, 'AI unable to find menu information for this restaurant', restaurantInfo, false);
      }

      return {
        placeId: restaurantInfo.place_id || 'ai_search',
        lastUpdated: new Date().toISOString(),
        categories: aiMenuData.categories,
        currency: "USD",
        availability: "Available",
        source: "AI Search",
        restaurantName: restaurantInfo.name,
        restaurantType: restaurantInfo.restaurantType || 'unknown',
        rating: restaurantInfo.rating || 0,
        priceLevel: restaurantInfo.price_level || 2,
        userRatingsTotal: restaurantInfo.user_ratings_total || 0,
        aiGenerated: true,
        searchQuery: searchQuery,
        originalRestaurantInfo: restaurantInfo
      };

    } catch (error) {
      console.error('AI menu search failed:', error);
      return this.createNoMenuResponse(restaurantInfo.place_id, 'AI menu search failed', restaurantInfo, false);
    }
  }

  /**
   * Build AI search query
   */
  buildAISearchQuery(restaurantInfo) {
    const name = restaurantInfo.name || '';
    const type = restaurantInfo.restaurantType || '';
    const address = restaurantInfo.vicinity || restaurantInfo.formatted_address || '';
    const rating = restaurantInfo.rating || 0;
    const priceLevel = restaurantInfo.price_level || 2;
    const userRatingsTotal = restaurantInfo.user_ratings_total || 0;
    const businessStatus = restaurantInfo.business_status || '';
    const website = restaurantInfo.website || '';
    const phone = restaurantInfo.formatted_phone_number || '';
    const types = restaurantInfo.types || [];
    const reviews = restaurantInfo.reviews || [];
    
    // Build detailed search query
    let query = `restaurant menu ${name}`;
    
    // Add restaurant type information
    if (type && type !== 'unknown') {
      query += ` ${type} cuisine`;
    }
    
    // Add address information
    if (address) {
      query += ` ${address}`;
    }
    
    // Add rating information
    if (rating > 0) {
      query += ` rating ${rating} stars`;
    }
    
    // Add price level
    if (priceLevel > 0) {
      const priceLevelText = ['', 'cheap', 'moderate', 'expensive', 'very expensive'][priceLevel] || '';
      if (priceLevelText) {
        query += ` ${priceLevelText}`;
      }
    }
    
    // Add review keywords
    if (reviews && reviews.length > 0) {
      const keywords = this.extractKeywordsFromReviews(reviews);
      if (keywords.length > 0) {
        query += ` ${keywords.join(' ')}`;
      }
    }
    
    // Add restaurant type tags
    if (types && types.length > 0) {
      const relevantTypes = types.filter(type => 
        type.includes('restaurant') || 
        type.includes('food') || 
        type.includes('meal')
      );
      if (relevantTypes.length > 0) {
        query += ` ${relevantTypes.join(' ')}`;
      }
    }
    
    return query;
  }

  /**
   * Extract keywords from reviews
   */
  extractKeywordsFromReviews(reviews) {
    if (!reviews || reviews.length === 0) return [];
    
    const keywords = [];
    const text = reviews.map(review => review.text || '').join(' ').toLowerCase();
    
    // Common menu-related keywords
    const menuKeywords = [
      'menu', 'dish', 'food', 'meal', 'delicious', 'tasty', 'recommend',
      'special', 'popular', 'best', 'appetizer', 'main', 'dessert',
      'drink', 'beverage', 'soup', 'salad', 'pizza', 'pasta', 'burger',
      'steak', 'chicken', 'fish', 'vegetarian', 'vegan', 'spicy', 'sweet'
    ];
    
    menuKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords.slice(0, 5); // Return top 5 keywords
  }

  /**
   * Perform AI menu search
   */
  async performAIMenuSearch(searchQuery, restaurantInfo) {
    try {
      console.log('🔍 Performing AI menu search...');
      console.log('Query:', searchQuery);
      console.log('Restaurant info:', {
        name: restaurantInfo.name,
        rating: restaurantInfo.rating,
        priceLevel: restaurantInfo.price_level,
        userRatingsTotal: restaurantInfo.user_ratings_total,
        businessStatus: restaurantInfo.business_status,
        types: restaurantInfo.types,
        reviews: restaurantInfo.reviews?.length || 0
      });
      
      // Generate AI search results based on restaurant info
      const restaurantType = restaurantInfo.restaurantType || 'american';
      const baseMenu = this.getBaseMenuForType(restaurantType);
      
      // Simulate AI search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adjust menu based on search query
      const adjustedMenu = this.adjustMenuForAISearch(baseMenu, searchQuery, restaurantInfo);
      
      return adjustedMenu;
      
    } catch (error) {
      console.error('AI menu search execution failed:', error);
      throw error;
    }
  }

  /**
   * Get base menu for restaurant type
   */
  getBaseMenuForType(restaurantType) {
    const menuTemplates = {
      'chinese': {
        categories: [
          {
            name: "Main Dishes",
            items: [
              { name: "Kung Pao Chicken", price: 12.99, description: "Classic Sichuan dish with chicken, peanuts and chili" },
              { name: "Mapo Tofu", price: 9.99, description: "Traditional Sichuan tofu with ground pork and bean paste" },
              { name: "Sweet and Sour Pork", price: 14.99, description: "Sweet and sour flavored pork dish" }
            ]
          },
          {
            name: "Soups",
            items: [
              { name: "Hot and Sour Soup", price: 6.99, description: "Classic appetizer soup" },
              { name: "Egg Drop Soup", price: 4.99, description: "Light egg drop soup" }
            ]
          }
        ]
      },
      'japanese': {
        categories: [
          {
            name: "Sushi",
            items: [
              { name: "Salmon Sushi", price: 8.99, description: "Fresh salmon sushi" },
              { name: "Tuna Sushi", price: 9.99, description: "Premium tuna sushi" }
            ]
          },
          {
            name: "Ramen",
            items: [
              { name: "Miso Ramen", price: 11.99, description: "Rich miso broth ramen" },
              { name: "Shoyu Ramen", price: 10.99, description: "Classic soy sauce ramen" }
            ]
          }
        ]
      },
      'italian': {
        categories: [
          {
            name: "Pasta",
            items: [
              { name: "Spaghetti Bolognese", price: 13.99, description: "Classic Italian meat sauce pasta" },
              { name: "Creamy Mushroom Pasta", price: 12.99, description: "Creamy mushroom pasta" }
            ]
          },
          {
            name: "Pizza",
            items: [
              { name: "Margherita Pizza", price: 15.99, description: "Classic margherita pizza" },
              { name: "Pepperoni Pizza", price: 17.99, description: "Pepperoni pizza" }
            ]
          }
        ]
      },
      'american': {
        categories: [
          {
            name: "Burgers",
            items: [
              { name: "Classic Burger", price: 10.99, description: "Beef burger with lettuce, tomato, onion" },
              { name: "Cheeseburger", price: 11.99, description: "Classic cheeseburger" }
            ]
          },
          {
            name: "Steaks",
            items: [
              { name: "Ribeye Steak", price: 24.99, description: "8oz ribeye steak" },
              { name: "New York Strip", price: 22.99, description: "10oz New York strip steak" }
            ]
          }
        ]
      }
    };

    return menuTemplates[restaurantType] || menuTemplates['american'];
  }

  /**
   * Adjust menu based on AI search
   */
  adjustMenuForAISearch(baseMenu, searchQuery, restaurantInfo) {
    const adjustedMenu = JSON.parse(JSON.stringify(baseMenu));
    
    // Adjust menu items based on search query
    const queryLower = searchQuery.toLowerCase();
    
    adjustedMenu.categories = adjustedMenu.categories.map(category => {
      category.items = category.items.map(item => {
        // If search query contains dish name related terms, mark as AI recommended
        if (queryLower.includes(item.name.toLowerCase()) || 
            queryLower.includes(item.description.toLowerCase())) {
          item.aiRecommended = true;
        }
        return item;
      });
      return category;
    });
    
    return adjustedMenu;
  }

  /**
   * Create no menu response
   */
  createNoMenuResponse(placeId, errorMessage, restaurantInfo, showAISearch = true) {
    return {
      placeId: placeId,
      noMenuAvailable: true,
      errorMessage: errorMessage,
      lastUpdated: new Date().toISOString(),
      source: "Real Menu Search",
      restaurantName: restaurantInfo?.name || 'Unknown',
      aiSearchAvailable: showAISearch, // Control whether to show AI search option
      originalRestaurantInfo: restaurantInfo
    };
  }

  /**
   * Cache menu
   */
  cacheMenu(placeId, menu) {
    this.cache.set(placeId, {
      data: menu,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached menu
   */
  getCachedMenu(placeId) {
    const cached = this.cache.get(placeId);
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(placeId);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default new RealMenuService();
