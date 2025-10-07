# Restaurant Recommender - Guide

## Overview

An AI-powered restaurant and cafe recommender built with React. It integrates the Google Maps Platform to get your current location, search nearby places, score results, and provide AI-assisted insights and menu guidance.

## Requirements

- Node.js 14+ (recommended 18+)
- npm 6+
- Google Maps API Key (Places, Maps JavaScript)

## Quick Start

1. Install dependencies

```bash
cd /Users/xxxx/Desktop/csc642
npm install
```

2. Create environment variables

```bash
cp .env.example .env  # if available, otherwise create manually
```

Edit `.env` and set:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. Start the dev server

```bash
npm start
```

The app opens at `http://localhost:3000`.

Tip: A helper script `./start.sh` is included. Running it will check for `.env`, install dependencies, and start the app.

## How to Use

- Click Get Location to allow the browser to access your location.
- Choose search radius, type, and price range, then search nearby, or switch to Text Search to search by query.
- Click a result to see details, reviews, and navigate; open the menu modal for menu items and AI suggestions.
- Use Favorites to save places; Search History keeps your recent searches locally.

## Project Structure

```
csc642/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AIChatModal.js
│   │   ├── ErrorMessage.js
│   │   ├── FavoritesPanel.js
│   │   ├── HelpModal.js
│   │   ├── LoadingSpinner.js
│   │   ├── LocationControls.js
│   │   ├── MapComponent.js
│   │   ├── MenuAIChat.js
│   │   ├── MenuModal.js
│   │   ├── PlaceDetailModal.js
│   │   ├── RecommendationList.js
│   │   └── ReviewsModal.js
│   ├── services/
│   │   ├── aiRecommendationService.js
│   │   ├── aiService.js
│   │   ├── currencyService.js
│   │   ├── favoritesService.js
│   │   ├── googleMapsService.js
│   │   ├── realMenuService.js
│   │   └── searchHistoryService.js
│   ├── utils/
│   │   └── envCheck.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Environment Variables

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key. Without it the map and places search will not work. The app validates this via `src/utils/envCheck.js` and logs a warning if missing.

## Scripts

- `npm start` — start the development server
- `npm run build` — production build to `build/`
- `npm test` — run tests (if any)
- `npm run eject` — eject CRA config

## Deployment

This project is configured as a standard CRA app. A `build/` directory is produced by `npm run build`. You can deploy the contents of `build/` to any static host (e.g., GitHub Pages via the provided `deploy` script, Netlify, etc.).
