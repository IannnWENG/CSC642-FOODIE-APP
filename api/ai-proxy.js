export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, recommendations, userLocation, selectedRestaurant } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.REACT_APP_AI_API_KEY || '72442665e4f1431e9e1d90b20e319acd.QEw43fX4e2ADJi2b';
    const apiUrl = process.env.REACT_APP_AI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const model = process.env.REACT_APP_AI_MODEL || 'glm-3-turbo';

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

    const prompt = `You are a professional restaurant menu assistant with access to detailed menu information. You help users choose dishes, understand menu items, and make informed dining decisions.

Context Information:
${context}

User Message: "${message}"

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

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
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
      console.error('AI API Error:', response.status, errorText);
      
      let errorMessage = 'AI 服務暫時無法使用，請稍後再試。';
      if (response.status === 401) {
        errorMessage = 'AI 服務認證失敗，請檢查 API 金鑰。';
      } else if (response.status === 429) {
        errorMessage = 'AI 服務請求過於頻繁，請稍後再試。';
      } else if (response.status >= 500) {
        errorMessage = 'AI 服務暫時無法使用，請稍後再試。';
      }
      
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ 
        response: data.choices[0].message.content 
      });
    } else {
      console.error('Invalid AI response format:', data);
      return res.status(500).json({ error: 'AI 回應格式異常，請稍後再試。' });
    }

  } catch (error) {
    console.error('AI Proxy Error:', error);
    return res.status(500).json({ error: 'AI 服務暫時無法使用，請稍後再試。' });
  }
}
