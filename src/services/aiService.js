class AIService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isVercel = window.location.hostname.includes('vercel.app');
    this.isFirebase = window.location.hostname.includes('firebaseapp.com') || 
                      window.location.hostname.includes('web.app');
    this.proxyUrl = process.env.REACT_APP_AI_PROXY_URL || '';
    
    console.log('AI Service Initialized:', {
      isProduction: this.isProduction,
      isVercel: this.isVercel,
      isFirebase: this.isFirebase,
      usingProxy: !!this.proxyUrl || this.isFirebase || this.isVercel
    });
  }

  /**
   * Call AI API to get response
   * @param {string} message - User's message
   * @param {Array} recommendations - Current restaurant recommendations list
   * @param {Object} userLocation - User location information
   * @param {Object} selectedRestaurant - Selected restaurant with menu info
   * @returns {Promise<string>} AI response
   */
  async getAIResponse(message, recommendations, userLocation, selectedRestaurant = null) {
    try {
      // Save context info for proxy use
      this.currentRecommendations = recommendations;
      this.currentUserLocation = userLocation;
      this.currentSelectedRestaurant = selectedRestaurant;
      
      // Build context information
      const context = this.buildContext(recommendations, userLocation, selectedRestaurant);
      
      // Build prompt
      const prompt = this.buildPrompt(message, context);
      
      // Call AI API
      const response = await this.callAIAPI(prompt);
      
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Build context information
   */
  buildContext(recommendations, userLocation, selectedRestaurant = null) {
    let context = '';
    
    if (userLocation) {
      context += `User location: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}\n`;
    }
    
    if (recommendations && recommendations.length > 0) {
      context += 'Current restaurant recommendations:\n';
      recommendations.slice(0, 5).forEach((place, index) => {
        context += `${index + 1}. ${place.name}\n`;
        context += `   - Rating: ${place.rating || 'N/A'}\n`;
        context += `   - Distance: ${place.distance ? place.distance.toFixed(1) + 'km' : 'Unknown'}\n`;
        context += `   - Address: ${place.vicinity || 'Address not available'}\n`;
        if (place.price_level !== undefined) {
          context += `   - Price: ${'$'.repeat(place.price_level + 1)}\n`;
        }
        context += '\n';
      });
    } else {
      context += 'No restaurant recommendations available at the moment.\n';
    }

    // Add selected restaurant menu information if available
    if (selectedRestaurant && selectedRestaurant.menu) {
      context += `\nSelected Restaurant: ${selectedRestaurant.name}\n`;
      context += 'Menu Information:\n';
      selectedRestaurant.menu.categories.forEach(category => {
        context += `${category.name}:\n`;
        category.items.forEach(item => {
          context += `  - ${item.name}: $${item.price} - ${item.description}\n`;
        });
        context += '\n';
      });
    }
    
    return context;
  }

  /**
   * Build AI prompt
   */
  buildPrompt(userMessage, context) {
    return `You are a helpful restaurant recommendation assistant. You have access to a list of nearby restaurants and can help users choose where to eat.

=== AVAILABLE RESTAURANTS ===
${context}
=== END OF RESTAURANTS ===

User's Question: "${userMessage}"

INSTRUCTIONS:
1. If the user asks for restaurant recommendations, ALWAYS recommend from the list above
2. When recommending, mention the restaurant name, rating, distance, and price level
3. Give specific reasons why you recommend each restaurant
4. If user asks in Chinese, respond in Chinese. If in English, respond in English.
5. Be friendly and helpful
6. If no restaurants are available, let the user know they need to search for restaurants first
7. You can compare restaurants and help users decide based on their preferences (price, distance, rating, etc.)

Your response:`;
  }

  /**
   * Call actual AI API via proxy
   */
  async callAIAPI(prompt) {
    // Use external proxy if configured
    if (this.proxyUrl) {
      return await this.callViaExternalProxy(prompt);
    }
    // Use Firebase/Vercel proxy
    if (this.isFirebase || this.isVercel) {
      return await this.callViaProxy(prompt);
    }
    
    // Local development - also use proxy
    return await this.callViaProxy(prompt);
  }

  /**
   * Call AI service via API proxy
   */
  async callViaProxy(prompt) {
    try {
      console.log('🔄 Using API proxy to call AI service');
      
      const response = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          recommendations: this.currentRecommendations || [],
          userLocation: this.currentUserLocation || null,
          selectedRestaurant: this.currentSelectedRestaurant || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI Proxy Error:', error);
      return `AI service temporarily unavailable: ${error.message}`;
    }
  }

  /**
   * Call AI service via external proxy (e.g., Cloudflare/Vercel/Netlify URL)
   */
  async callViaExternalProxy(prompt) {
    try {
      console.log('🔄 Using External API proxy to call AI service', this.proxyUrl);
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          recommendations: this.currentRecommendations || [],
          userLocation: this.currentUserLocation || null,
          selectedRestaurant: this.currentSelectedRestaurant || null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.result || '';
    } catch (error) {
      console.error('External AI Proxy Error:', error);
      return `AI service temporarily unavailable: ${error.message}`;
    }
  }

  /**
   * Check if AI service is available
   */
  async checkAvailability() {
    try {
      // Send a simple test request
      const testResponse = await this.getAIResponse('Hello', [], null);
      return testResponse !== null;
    } catch (error) {
      console.error('AI Service not available:', error);
      return false;
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
