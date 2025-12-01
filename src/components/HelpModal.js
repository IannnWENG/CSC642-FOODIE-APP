import React from 'react';
import { X, MapPin, Search, Heart, Star, Clock, Navigation } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      title: "Get Location",
      description: "Click the 'Get Location' button to allow the browser to access your location information. This is a necessary step to search for nearby restaurants."
    },
    {
      icon: <Search className="w-6 h-6 text-green-500" />,
      title: "Set Search Criteria",
      description: "Choose search radius (500 meters to 5 km), place type (restaurants, cafes, etc.) and price range."
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "View AI Recommendations",
      description: "The system will intelligently sort based on ratings, distance, price and other factors, displaying recommendation results on the map and in the list."
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Favorite Places",
      description: "Click on places to view detailed information, you can favorite restaurants you like for easy viewing later."
    },
    {
      icon: <Navigation className="w-6 h-6 text-purple-500" />,
      title: "Navigate to Destination",
      description: "Click the 'Navigate' button on the detail page to open Google Maps navigation to that location."
    }
  ];

  const features = [
    {
      title: "AI Smart Recommendations",
      description: "Calculate recommendation scores based on multiple factors such as ratings, distance, price, and number of reviews"
    },
    {
      title: "Context Awareness",
      description: "Automatically adjust recommendations based on time and weather (e.g., recommend cafes during breakfast time)"
    },
    {
      title: "Personalized Learning",
      description: "The system learns your preferences to provide more accurate recommendations"
    },
    {
      title: "Multiple Search Types",
      description: "Support various food types including restaurants, cafes, bakeries, takeaway, etc."
    },
    {
      title: "Detailed Information",
      description: "Provide complete information including opening hours, contact details, reviews, photos, etc."
    },
    {
      title: "Favorites Management",
      description: "Save favorite places and create a personal food list"
    }
  ];

  const tips = [
    "It's recommended to get accurate location information before searching",
    "You can try different search ranges to discover more options",
    "When viewing detailed information, the latest opening hours and reviews will be automatically loaded",
    "Favorite places are saved in the browser and can still be viewed when you open it next time",
    "Higher recommendation scores indicate more worth trying",
    "You can share your favorite restaurants with friends"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-slideUp sm:animate-fadeInUp flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">User Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto overscroll-contain flex-1">
          {/* Quick Start */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Quick Start</h3>
            <div className="space-y-2 sm:space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 scale-75 sm:scale-100 origin-top-left">
                    {step.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-xl bg-white">
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Tips */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Usage Tips</h3>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-xs sm:text-base">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation Score Explanation */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recommendation Score</h3>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
              <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-base">
                The AI system calculates scores based on:
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">Rating (40%)</div>
                  <p className="text-gray-600 text-xs">Google ratings & reviews</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">Distance (30%)</div>
                  <p className="text-gray-600 text-xs">From your location</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">Price (20%)</div>
                  <p className="text-gray-600 text-xs">$ to $$$</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">Reviews (10%)</div>
                  <p className="text-gray-600 text-xs">Total count</p>
                </div>
              </div>
            </div>
          </section>

          {/* Map Legend */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Map Legend</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">Your location</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">High (70+)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">Medium (50-69)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">Low (&lt;50)</span>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Important Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-xl">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li>• Browser location permission required</li>
                <li>• HTTPS recommended for security</li>
                <li>• Restaurant info from Google Places API</li>
                <li>• Opening hours may not be up-to-date</li>
                <li>• Data saved in browser storage</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom button */}
        <div className="flex justify-end p-4 sm:p-6 border-t bg-gray-50 safe-area-bottom">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
