import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import aiService from '../services/aiService';

const MenuAIChat = ({ place, menu, recommendations, userLocation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (menu && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Hi! I can help you choose from ${place.name}'s menu. I can recommend dishes based on your preferences, explain menu items, or suggest popular choices. What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [menu, place, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const restaurantWithMenu = {
        ...place,
        menu: menu
      };

      const response = await aiService.getAIResponse(
        inputMessage,
        recommendations,
        userLocation,
        restaurantWithMenu
      );

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
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

  const quickQuestions = [
    "What's popular here?",
    "Recommend something healthy",
    "What's good for vegetarians?",
    "Show me the best value items"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl transition-all duration-300 overflow-hidden ${
      isExpanded ? 'max-h-[500px] sm:max-h-96' : 'max-h-14 sm:max-h-16'
    }`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">AI Menu Assistant</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {isExpanded ? 'Ask me about the menu!' : 'Tap to chat'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {isExpanded && (
        <div className="flex flex-col" style={{ height: 'calc(100% - 56px)' }}>
          {/* Messages - Smooth scrolling */}
          <div 
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 overscroll-contain"
            style={{ 
              maxHeight: messages.length <= 1 ? '120px' : '200px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-1.5 sm:gap-2 max-w-[88%] sm:max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    ) : (
                      <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    )}
                  </div>
                  <div className={`rounded-xl px-2.5 sm:px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-[10px] sm:text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-xl px-2.5 sm:px-3 py-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs sm:text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Horizontal scroll on mobile */}
          {messages.length <= 1 && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="flex-shrink-0 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 active:bg-purple-200 transition-colors whitespace-nowrap"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="p-2.5 sm:p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the menu..."
                className="flex-1 px-3 py-2.5 sm:py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 active:from-purple-700 active:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuAIChat;
