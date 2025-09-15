# Restaurant Recommender - User Guide

## Project Overview
This is an AI-powered restaurant and cafe recommendation system built with React, integrating Google Maps API to provide location services and restaurant recommendations.

##  System Requirements
- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher
- **Google Maps API Key**: For maps and location services

##  Quick Start

### Method 1: Using Startup Script (Recommended)
1. Open Terminal
2. Navigate to project directory:
   ```bash
   cd /Users/wenglien/Desktop/csc642
   ```
3. Run the startup script:
   ```bash
   ./start.sh
   ```
   
   The startup script will automatically:
   - Check and create `.env` file
   - Install necessary dependencies
   - Start the application

### Method 2: Manual Setup
1. Open Terminal and navigate to project directory:
   ```bash
   cd /Users/wenglien/Desktop/csc642
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file:
   ```bash
   touch .env
   ```

4. Edit `.env` file and add your Google Maps API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

5. Start the application:
   ```bash
   npm start
   ```
   

## Using the Application

1. After starting, the application will automatically open in your browser at `http://localhost:3000`
2. Allow browser to access your location (for nearby restaurant recommendations)
3. Use map features to browse and search for restaurants
4. View AI-recommended restaurants and cafes

## Project Structure
```
csc642/
├── public/                 # Static files
│   └── index.html         # HTML template
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── AIChatModal.js
│   │   ├── ErrorMessage.js
│   │   ├── FavoritesPanel.js
│   │   ├── HelpModal.js
│   │   ├── LoadingSpinner.js
│   │   ├── LocationControls.js
│   │   ├── MapComponent.js
│   │   ├── PlaceDetailModal.js
│   │   └── RecommendationList.js
│   ├── services/          # Service layer
│   │   ├── aiRecommendationService.js
│   │   ├── aiService.js
│   │   ├── favoritesService.js
│   │   ├── googleMapsService.js
│   │   └── searchHistoryService.js
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Project configuration and dependencies
├── start.sh             # Startup script
└── tailwind.config.js   # Tailwind CSS configuration
```

## Available Commands

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject Create React App configuration



### Reinstalling the Project
If you encounter issues, you can completely reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```


