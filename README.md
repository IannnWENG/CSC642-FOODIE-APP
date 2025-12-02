# Foodie Tracker

An AI-powered restaurant and cafe recommender built with React. It integrates the Google Maps Platform to get your current location, search nearby places, score results, and provide AI-assisted insights and recommendations.

🌐 **Live Demo**: [https://foodieapp-df66c.web.app](https://foodieapp-df66c.web.app)

## Features

### Core Features

- **Location-based Search** - Get your current location and search nearby restaurants
- **Interactive Map** - View restaurants on Google Maps with color-coded score markers
- **AI Recommendations** - Get personalized restaurant recommendations powered by Groq AI
- **Ratings & Reviews** - View restaurant ratings, reviews, and detailed information
- **Favorites** - Save your favorite restaurants locally
- **Advanced Filters** - Filter by radius, type, and price range

### AI Features

- **AI Chat Assistant** - Ask questions about restaurants and get personalized recommendations
- **Menu AI Assistant** - Get dish recommendations and menu insights
- **Smart Translation** - Automatically detect and translate non-English reviews to English

### Additional Features

- **Search History** - Keep track of your recent searches locally
- **Real-time Menu Data** - View restaurant menus with AI-powered search fallback
- **Mobile Optimized** - Responsive design with smooth scrolling and touch-friendly UI

## Requirements

- Node.js 18+
- npm 6+
- Google Maps API Key (Places, Maps JavaScript)
- Firebase Account (for deployment)

## Quick Start

### 1. Install dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Create environment variables

```bash
cp .env.example .env
```

Edit `.env` and set:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Start the dev server

```bash
npm start
```

The app opens at `http://localhost:3000`.

## How to Use

1. Click **Get Location** to allow the browser to access your location
2. Choose search radius, type, and price range, then click **Search Nearby**
3. Click a restaurant marker or list item to see details
4. Click the **robot icon** 🤖 to open AI chat and ask for recommendations
5. Use Favorites to save places; Search History keeps your recent searches locally
6. Click **Translate** 🌐 on non-English reviews to see English translations

## AI Assistant

The AI assistant can help you:

- Get personalized restaurant recommendations
- Compare restaurants by rating, distance, and price
- Answer questions about nearby restaurants
- Recommend dishes from restaurant menus
- Translate reviews to English

**Example questions:**

- "Which restaurant is closest?"
- "Find me a cheap place to eat"
- "What's popular at this restaurant?"
- "Recommend something healthy"

## Project Structure

```
csc642/
├── api/
│   └── ai-proxy.js               # Legacy Vercel serverless function
├── functions/
│   ├── index.js                  # Firebase Cloud Functions (Groq AI proxy)
│   ├── package.json
│   └── .env                      # Groq API key (not in git)
├── public/
│   ├── 404.html
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AIChatModal.js        # AI chat interface
│   │   ├── ErrorMessage.js       # Error display component
│   │   ├── FavoritesPanel.js     # Favorites management panel
│   │   ├── HelpModal.js          # Help & instructions modal
│   │   ├── LoadingSpinner.js     # Loading indicator
│   │   ├── LocationControls.js   # Location & search controls
│   │   ├── LoginModal.js         # User login modal
│   │   ├── MapComponent.js       # Google Maps integration
│   │   ├── MenuAIChat.js         # Menu AI assistant
│   │   ├── MenuModal.js          # Restaurant menu display
│   │   ├── PlaceDetailModal.js   # Place details view
│   │   ├── RecommendationList.js # AI recommendations list
│   │   ├── RegisterModal.js      # User registration modal
│   │   └── ReviewsModal.js       # Place reviews display
│   ├── contexts/
│   │   └── AuthContext.js        # Authentication context provider
│   ├── services/
│   │   ├── aiRecommendationService.js  # AI recommendation scoring
│   │   ├── aiService.js          # AI API integration
│   │   ├── authService.js        # Authentication service
│   │   ├── currencyService.js    # Currency conversion
│   │   ├── favoritesService.js   # Favorites storage
│   │   ├── googleMapsService.js  # Google Maps API wrapper
│   │   ├── realMenuService.js    # Menu data service
│   │   ├── searchHistoryService.js # Search history storage
│   │   └── translateService.js   # AI-powered translation
│   ├── utils/
│   │   └── envCheck.js           # Environment validation
│   ├── App.js                    # Main application component
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles (Tailwind)
├── firebase.json                 # Firebase configuration
├── .firebaserc                   # Firebase project settings
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Environment Variables

### Frontend (.env)

| Variable                        | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key for maps and places search |
| `REACT_APP_AI_PROXY_URL`        | (Optional) External AI proxy URL               |

### Firebase Functions (functions/.env)

| Variable       | Description                   |
| -------------- | ----------------------------- |
| `GROQ_API_KEY` | Groq API key for AI responses |

## Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Maps**: Google Maps JavaScript API, Places API
- **AI**: Groq API (Llama 3.1)
- **Hosting**: Firebase Hosting
- **Backend**: Firebase Cloud Functions
- **Fonts**: Outfit, Inter (Google Fonts)

## Key Features Explained

### AI Score System

Each restaurant receives an AI-calculated score (0-100) based on:

- Rating (40%)
- Distance from user (30%)
- Price level (20%)
- Number of reviews (10%)

Map markers are color-coded:

- 🟢 Green: 70+ (Excellent)
- 🟡 Amber: 50-69 (Good)
- ⚪ Gray: <50 (Fair)

### Translation Feature

- Automatically detects non-English reviews (Chinese, Japanese, Korean, Arabic, etc.)
- One-click translation to English using AI
- Shows original text alongside translation
- Translations are cached for better performance

## Limitations

- Some UI components (login, registration) are prototypes
- Search results depend on Google Maps API availability and quota
- AI responses may vary in accuracy
- Favorites and search history are stored in browser localStorage
- Translation requires AI API access

## License

MIT License
