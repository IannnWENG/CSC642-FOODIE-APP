class AIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_AI_API_KEY || '72442665e4f1431e9e1d90b20e319acd.QEw43fX4e2ADJi2b';
    this.apiUrl = process.env.REACT_APP_AI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.model = process.env.REACT_APP_AI_MODEL || 'glm-3-turbo';    
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isVercel = window.location.hostname.includes('vercel.app');
    
    console.log('🤖 AI Service Initialized:', {
      hasApiKey: !!this.apiKey,
      hasApiUrl: !!this.apiUrl,
      model: this.model,
      isProduction: this.isProduction,
      isVercel: this.isVercel
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
    return `You are a professional restaurant menu assistant with access to detailed menu information. You help users choose dishes, understand menu items, and make informed dining decisions.

Context Information:
${context}

User Message: "${userMessage}"

Please provide a helpful and friendly response. You should:
1. Be conversational and helpful, focusing on menu recommendations
2. Use the available menu information to provide specific dish recommendations
3. When discussing menu items, always mention prices, descriptions, and why you recommend them
4. Help users understand dietary options (vegetarian, vegan, gluten-free, etc.)
5. Suggest popular or signature dishes from the menu
6. Provide value recommendations (best bang for buck)
7. Consider different meal times and occasions (breakfast, lunch, dinner, date night, etc.)
8. If asked about specific dietary needs, filter menu items accordingly
9. Keep responses concise but informative
10. Use emojis sparingly to make responses more engaging
11. Support both English and Chinese conversations, respond in the same language as the user
12. When recommending dishes, explain why they're good choices
13. If the user asks about combinations, suggest complementary dishes
14. Always be encouraging and positive about the dining experience

Response:`;
  }

  /**
   * Call actual AI API
   * You need to implement this method according to your chosen AI service provider
   */
  async callAIAPI(prompt) {
    // Use proxy API in Vercel environment
    if (this.isVercel) {
      return await this.callViaProxy(prompt);
    }
    
    // Direct call in local environment
    if (!this.apiUrl) {
      return 'AI service not configured. Please set REACT_APP_AI_API_URL and REACT_APP_AI_API_KEY in environment variables.';
    }
    if (this.apiUrl.includes('zhipu') || this.apiUrl.includes('bigmodel') || this.model.includes('glm')) {
      return await this.callGLM(prompt);
    }
    return 'AI service endpoint provider not supported. Please check configuration.';
  }

  /**
   * Call AI service via Vercel API proxy
   */
  async callViaProxy(prompt) {
    try {
      console.log('🔄 Using Vercel API proxy to call AI service');
      
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
   * GLM Zhipu AI API call
   */
  async callGLM(prompt) {
    console.log('Calling GLM API with model:', this.model);
    console.log('API Key:', this.apiKey ? 'Set' : 'Not set');
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GLM API Error:', response.status, errorText);
      throw new Error(`GLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('GLM API Response:', data);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from GLM API');
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
