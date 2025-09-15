import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import aiService from '../services/aiService';

const AIChatModal = ({ isOpen, onClose, recommendations, userLocation, selectedRestaurant, onRestaurantAnalysis }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: "Hi! I'm your AI restaurant assistant 🤖 I can help you find the perfect place to eat based on your preferences, answer questions about recommended restaurants, and provide personalized suggestions. What would you like to know?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Handle automatic analysis of selected restaurant
  useEffect(() => {
    if (selectedRestaurant && isOpen) {
      handleRestaurantAnalysis(selectedRestaurant);
    }
  }, [selectedRestaurant, isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use AI service to get response
      const aiResponse = await aiService.getAIResponse(inputMessage.trim(), recommendations, userLocation);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or check your internet connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle restaurant analysis
  const handleRestaurantAnalysis = async (restaurant) => {
    if (isLoading) return;

    const analysisMessage = {
      id: Date.now(),
      type: 'user',
      content: `Please analyze this restaurant and recommend dishes: ${restaurant.name}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, analysisMessage]);
    setIsLoading(true);

    try {
      // Build restaurant analysis prompt
      const analysisPrompt = `Please analyze this restaurant and provide dish recommendations:

Restaurant Information:
- Name: ${restaurant.name}
- Rating: ${restaurant.rating || 'N/A'}
- Address: ${restaurant.vicinity || 'Address not available'}
- Distance: ${restaurant.distance ? restaurant.distance.toFixed(1) + 'km' : 'Unknown'}
- Price Level: ${restaurant.price_level !== undefined ? '$'.repeat(restaurant.price_level + 1) : 'Unknown'}

Please provide:
1. A brief overview of this restaurant
2. Recommended dishes based on the restaurant type and rating
3. What makes this restaurant special
4. Best time to visit
5. Any tips for ordering

Keep the response engaging and helpful.`;

      const aiResponse = await aiService.getAIResponse(analysisPrompt, [restaurant], userLocation);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Notify parent component that analysis is complete
      if (onRestaurantAnalysis) {
        onRestaurantAnalysis(restaurant, aiResponse);
      }
    } catch (error) {
      console.error('Restaurant analysis error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble analyzing this restaurant right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 lg:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-xl">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI Restaurant Assistant
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Ask me anything about restaurants!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              
              {message.type === 'user' && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-500" />
                  <p className="text-xs sm:text-sm text-gray-500">AI is thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200/50">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about restaurants..."
              className="flex-1 p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
