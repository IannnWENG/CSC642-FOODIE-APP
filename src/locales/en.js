// English translations
const en = {
  // App
  app: {
    title: 'Foodie Tracker',
    subtitle: 'Discover your next favorite meal',
    footer: 'Powered by AI & Google Maps'
  },

  // Common
  common: {
    loading: 'Loading...',
    search: 'Search',
    close: 'Close',
    done: 'Done',
    clear: 'Clear',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    view: 'View',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    all: 'All',
    found: 'found',
    yes: 'Yes',
    no: 'No',
    error: 'Error',
    retry: 'Retry',
    logout: 'Logout',
    login: 'Login',
    signUp: 'Sign Up'
  },

  // Navigation
  nav: {
    ai: 'AI',
    saved: 'Saved',
    history: 'History',
    update: 'UPDATE',
    locate: 'LOCATE',
    exit: 'Exit',
    help: 'Help',
    profile: 'Profile',
    tour: 'Tour'
  },

  // Location Controls
  location: {
    found: 'Location Found',
    findNearby: 'Find Nearby',
    enableLocation: 'Enable location to discover places',
    gettingLocation: 'Getting Location...',
    updateMyLocation: '📍 Update My Location',
    getMyLocation: '🎯 Get My Location',
    pleaseGetLocation: 'Please get your location first'
  },

  // Search
  search: {
    nearby: 'Nearby',
    searchMode: 'Search',
    placeholder: 'Search restaurants, cafes...',
    recent: 'Recent',
    suggestions: 'Suggestions',
    findPlaces: 'Find Places',
    searching: 'Searching...',
    type: 'Type',
    distance: 'Distance',
    price: 'Price'
  },

  // Place Types
  placeTypes: {
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bakery: 'Bakery',
    takeaway: 'Takeaway'
  },

  // Map
  map: {
    exploreMap: 'Explore Map',
    live: 'Live',
    yourLocation: 'Your location',
    high: 'High (70+)',
    medium: 'Medium (50-69)',
    low: 'Low (<50)'
  },

  // Recommendations
  recommendations: {
    forYou: 'For You',
    quickView: 'Quick View',
    findingPlaces: 'Finding places...',
    call: '📞 Call',
    website: '🌐 Website'
  },

  // Login Modal
  login: {
    welcomeBack: 'Welcome back',
    signInContinue: 'Sign in to continue your food journey',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    demoAccount: 'Demo Account',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    newHere: 'New here?',
    createAccount: 'Create account',
    loginFailed: 'Login failed',
    loginError: 'An error occurred during login'
  },

  // Register Modal
  register: {
    createAccountTitle: 'Create account',
    startDiscovering: 'Start discovering amazing food spots',
    name: 'Name',
    namePlaceholder: 'Your name',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm password',
    minCharacters: 'Min. 6 characters',
    creatingAccount: 'Creating account...',
    createAccountBtn: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    passwordsNotMatch: 'Passwords do not match',
    registrationFailed: 'Registration failed',
    registrationError: 'An error occurred during registration'
  },

  // Favorites
  favorites: {
    myFavorites: 'My Favorites',
    favoritePlaces: 'favorite places',
    restaurants: 'Restaurants',
    cafes: 'Cafes',
    others: 'Others',
    noFavorites: 'No favorite places yet',
    startExploring: 'Start exploring and favorite restaurants you like!',
    clearAll: 'Clear All',
    confirmClear: 'Are you sure you want to clear all favorites?',
    removeFromFavorites: 'Remove from favorites'
  },

  // History
  history: {
    title: 'History',
    searches: 'searches',
    noHistory: 'No history yet',
    searchesAppear: 'Your searches will appear here',
    clearHistory: 'Clear all history?'
  },

  // Help Modal
  help: {
    userGuide: 'User Guide',
    quickStart: 'Quick Start',
    features: 'Features',
    usageTips: 'Usage Tips',
    recommendationScore: 'Recommendation Score',
    mapLegend: 'Map Legend',
    importantNotes: 'Important Notes',
    getStarted: 'Get Started',

    // Steps
    step1Title: 'Get Location',
    step1Desc: "Click the 'Get Location' button to allow the browser to access your location information. This is a necessary step to search for nearby restaurants.",
    step2Title: 'Set Search Criteria',
    step2Desc: 'Choose search radius (500 meters to 5 km), place type (restaurants, cafes, etc.) and price range.',
    step3Title: 'View AI Recommendations',
    step3Desc: 'The system will intelligently sort based on ratings, distance, price and other factors, displaying recommendation results on the map and in the list.',
    step4Title: 'Favorite Places',
    step4Desc: 'Click on places to view detailed information, you can favorite restaurants you like for easy viewing later.',
    step5Title: 'Navigate to Destination',
    step5Desc: "Click the 'Navigate' button on the detail page to open Google Maps navigation to that location.",

    // Features
    feature1Title: 'AI Smart Recommendations',
    feature1Desc: 'Calculate recommendation scores based on multiple factors such as ratings, distance, price, and number of reviews',
    feature2Title: 'Context Awareness',
    feature2Desc: 'Automatically adjust recommendations based on time and weather (e.g., recommend cafes during breakfast time)',
    feature3Title: 'Personalized Learning',
    feature3Desc: 'The system learns your preferences to provide more accurate recommendations',
    feature4Title: 'Multiple Search Types',
    feature4Desc: 'Support various food types including restaurants, cafes, bakeries, takeaway, etc.',
    feature5Title: 'Detailed Information',
    feature5Desc: 'Provide complete information including opening hours, contact details, reviews, photos, etc.',
    feature6Title: 'Favorites Management',
    feature6Desc: 'Save favorite places and create a personal food list',

    // Tips
    tip1: "It's recommended to get accurate location information before searching",
    tip2: 'You can try different search ranges to discover more options',
    tip3: 'When viewing detailed information, the latest opening hours and reviews will be automatically loaded',
    tip4: 'Favorite places are saved in the browser and can still be viewed when you open it next time',
    tip5: 'Higher recommendation scores indicate more worth trying',
    tip6: 'You can share your favorite restaurants with friends',

    // Score explanation
    scoreExplanation: 'The AI system calculates scores based on:',
    rating: 'Rating (40%)',
    ratingDesc: 'Google ratings & reviews',
    distance: 'Distance (30%)',
    distanceDesc: 'From your location',
    priceLabel: 'Price (20%)',
    priceDesc: '$ to $$$',
    reviews: 'Reviews (10%)',
    reviewsDesc: 'Total count',

    // Notes
    note1: 'Browser location permission required',
    note2: 'HTTPS recommended for security',
    note3: 'Restaurant info from Google Places API',
    note4: 'Opening hours may not be up-to-date',
    note5: 'Data saved in browser storage'
  },

  // Onboarding Tour
  tour: {
    // Welcome
    welcomeTitle: "Welcome to Foodie Tracker! ",
    welcomeDesc: "Your AI-powered restaurant discovery companion. Let's take a quick tour to help you get started and discover amazing places to eat!",
    
    // Steps
    step1Title: "Step 1: Get Your Location ",
    step1Desc: "First, click this button to enable location services. This helps us find restaurants near you. The button will pulse when location is needed!",
    
    step2Title: "Step 2: Choose Search Mode ",
    step2Desc: "Switch between 'Nearby' for quick discovery or 'Search' to find specific restaurants, cuisines, or dishes by name.",
    
    step3Title: "Step 3: Set Your Preferences ",
    step3Desc: "Customize your search with filters! Choose restaurant type (Restaurant, Cafe, Bakery), distance (500m to 5km), and price range ($-$$$).",
    
    step4Title: "Step 4: Start Searching ",
    step4Desc: "Once you've set your preferences, click this button to find places. Our AI will analyze and rank the best options for you!",
    
    mapTitle: "Interactive Map ",
    mapDesc: "Results appear on the map as colored markers. Green (70+) = Excellent, Amber (50-69) = Good, Gray (<50) = Fair. Click any marker to see details!",
    
    recommendationsTitle: "AI Recommendations ",
    recommendationsDesc: "Browse the curated list of places ranked by our AI. Each card shows the score, rating, distance, and price. Click to view full details!",
    
    aiAssistantTitle: "AI Assistant ",
    aiAssistantDesc: "Need personalized recommendations? Chat with our AI assistant! Ask about cuisines, get dish suggestions, or compare restaurants.",
    
    favoritesTitle: "Save Your Favorites ",
    favoritesDesc: "Found a place you love? Save it to your favorites! Access your saved restaurants anytime from this button.",
    
    historyTitle: "Search History ",
    historyDesc: "View your past searches and quickly revisit places you've discovered. Your history is saved locally for easy access.",
    
    menuFeatureTitle: "Explore Restaurant Menus ",
    menuFeatureDesc: "When viewing restaurant details, tap the menu icon to see available dishes. Our AI can even recommend dishes based on the menu!",
    
    completeTitle: "You're All Set! ",
    completeDesc: "That's everything you need to know! Start exploring and discover your next favorite restaurant. Happy dining!",
    
    // Mobile specific
    mobileWelcomeTitle: "Welcome to Foodie Tracker! ",
    mobileWelcomeDesc: "Your AI-powered restaurant discovery companion, optimized for mobile! Let's take a quick tour of the app.",
    
    touchGesturesTitle: "Touch Gestures ",
    touchGesturesDesc: "This app is designed for touch! Tap cards to view details, swipe lists to scroll, and use pinch gestures on the map to zoom.",
    
    bottomNavTitle: "Bottom Navigation Bar ",
    bottomNavDesc: "Your main controls are at the bottom of the screen for easy thumb access. All key features are just one tap away!",
    
    mobileLocationTitle: "Location Button ",
    mobileLocationDesc: "The big button in the center! Tap it to get your location. It will pulse orange when location is needed, and turn blue once found.",
    
    searchOptionsTitle: "Search Options ",
    searchOptionsDesc: "Toggle between 'Nearby' for quick discovery or 'Search' to type what you're craving. Set your preferred distance and price range below!",
    
    filterSearchTitle: "Filter Your Search ",
    filterSearchDesc: "Choose distance (500m - 5km) and price range ($-$$$). Tap any option to select it. Your choices affect the AI recommendations!",
    
    findPlacesTitle: "Find Places Button ",
    findPlacesDesc: "Once you've set your preferences, tap this button. Our AI will find and rank the best restaurants near you!",
    
    swipeResultsTitle: "Swipe Through Results ",
    swipeResultsDesc: "Scroll through AI-ranked restaurants. Each card shows score, rating, distance & price. Tap any card to see full details, reviews, and menu!",
    
    mobileMapTitle: "Interactive Map ",
    mobileMapDesc: "Pinch to zoom, drag to pan! Colored markers show restaurant scores: Green = Excellent (70+), Amber = Good (50-69), Gray = Fair.",
    
    mobileAiTitle: "AI Chat Assistant ",
    mobileAiDesc: "Tap the AI button to chat! Ask for recommendations, compare restaurants, or get dish suggestions. Your personal food advisor!",
    
    mobileFavoritesTitle: "Saved Places ",
    mobileFavoritesDesc: "Tap to view your saved restaurants. Add favorites from any restaurant detail page by tapping the heart icon!",
    
    mobileHistoryTitle: "Search History ",
    mobileHistoryDesc: "Quick access to your past searches. Great for revisiting places you've discovered before!",
    
    proTipsTitle: "Pro Tips for Mobile ",
    proTipsDesc: "• Pull down to refresh results\n• Long-press markers for quick actions\n• Shake to reset search\n• Swipe cards left to dismiss",
    
    readyTitle: "Ready to Explore! ",
    readyDesc: "You're all set! Start by tapping the location button, then search for your next delicious meal. Happy dining!",
    
    // Navigation
    step: 'Step',
    of: 'of',
    getStarted: 'Get Started',
    start: 'Start',
    swipeToNavigate: 'Swipe to navigate',
    skipTour: 'Already know how to use? Skip the tour',
    mobileOptimized: 'Mobile-Optimized Tour',
    startTour: 'Start Tour'
  },

  // Language Selector
  language: {
    selectLanguage: 'Select Language',
    choosePreferred: 'Choose your preferred language',
    english: 'English',
    chinese: '繁體中文',
    continue: 'Continue'
  },

  // AI Chat
  aiChat: {
    title: 'AI Assistant',
    placeholder: 'Ask me anything about food...',
    send: 'Send',
    thinking: 'Thinking...'
  },

  // Profile
  profile: {
    title: 'Profile',
    level: 'Level',
    levelNewbie: 'Newbie',
    levelFoodie: 'Foodie',
    levelExplorer: 'Explorer',
    levelExpert: 'Expert',
    levelMaster: 'Master',
    
    // Tabs
    tabOverview: 'Overview',
    tabActivity: 'Activity',
    tabAchievements: 'Achievements',
    
    // Stats
    searches: 'Searches',
    placesViewed: 'Places Viewed',
    favorites: 'Favorites',
    aiChats: 'AI Chats',
    menusViewed: 'Menus',
    navigations: 'Navigations',
    
    // Account Info
    accountInfo: 'Account Info',
    email: 'Email',
    memberSince: 'Member Since',
    accountAge: 'Account Age',
    days: 'days',
    
    // Activity
    loginStreak: 'Login Streak',
    best: 'Best',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity',
    justNow: 'just now',
    minutesAgo: 'min ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    
    // Categories
    topCategories: 'Top Categories',
    
    // Achievements
    achievementsUnlocked: 'Achievements Unlocked',
    achievementFirstSearch: 'First Search',
    achievementFirstSearchDesc: 'Complete your first search',
    achievementExplorer: 'Explorer',
    achievementExplorerDesc: 'Complete 10 searches',
    achievementCollector: 'Collector',
    achievementCollectorDesc: 'Save 5 favorites',
    achievementAIFriend: 'AI Friend',
    achievementAIFriendDesc: 'Chat with AI 10 times',
    achievementNavigator: 'Navigator',
    achievementNavigatorDesc: 'Navigate to 5 places',
    achievementStreakMaster: 'Streak Master',
    achievementStreakMasterDesc: '7 day login streak'
  },

  // Place Details
  placeDetails: {
    rating: 'Rating',
    reviews: 'Reviews',
    openNow: 'Open Now',
    closed: 'Closed',
    hours: 'Opening Hours',
    address: 'Address',
    phone: 'Phone',
    website: 'Official Website',
    navigate: 'Get Directions',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    viewMenu: 'View Menu',
    noReviews: 'No reviews yet',
    priceUnknown: 'Price unknown',
    categories: 'Categories',
    ratingDistribution: 'Rating Distribution',
    showLess: 'Show Less',
    showAllReviews: 'Show All Reviews',
    translate: 'Translate',
    original: 'Original',
    helpful: 'Helpful',
    notHelpful: 'Not Helpful',
    newest: 'Newest',
    oldest: 'Oldest',
    highest: 'Highest',
    lowest: 'Lowest',
    allRatings: 'All Ratings',
    stars: 'Stars'
  },

  // Error Messages
  errors: {
    locationError: 'Failed to get location. Please enable location services.',
    searchError: 'Search failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    genericError: 'Something went wrong. Please try again.',
    
    // Firebase Auth Errors
    emailInUse: 'This email is already registered',
    invalidEmail: 'Please enter a valid email address',
    weakPassword: 'Password must be at least 6 characters',
    userDisabled: 'This account has been disabled',
    userNotFound: 'Invalid email or password',
    wrongPassword: 'Invalid email or password',
    tooManyRequests: 'Too many failed attempts. Please try again later',
    allFieldsRequired: 'All fields are required'
  }
};

export default en;

