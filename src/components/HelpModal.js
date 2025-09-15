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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">User Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Start */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Start</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Tips */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Usage Tips</h3>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation Score Explanation */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendation Score Explanation</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">
                The AI recommendation system calculates recommendation scores based on the following factors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Rating Weight (40%)</div>
                  <p className="text-gray-600">Google ratings and number of reviews</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Distance Weight (30%)</div>
                  <p className="text-gray-600">Distance from your location</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Price Weight (20%)</div>
                  <p className="text-gray-600">Price level ($ to $$$)</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Review Count (10%)</div>
                  <p className="text-gray-600">Total number of reviews</p>
                </div>
              </div>
            </div>
          </section>

          {/* Map Legend */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Map Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Your location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">High Score (70+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Medium Score (50-69)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">Low Score (&lt;50)</span>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Browser location permission must be enabled to use this application</li>
                <li>• It is recommended to use HTTPS connection to ensure location information security</li>
                <li>• Restaurant information comes from Google Places API and may have update delays</li>
                <li>• Opening hours and price information are for reference only, please refer to actual conditions</li>
                <li>• Favorites and search history are saved in browser local storage</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom button */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
