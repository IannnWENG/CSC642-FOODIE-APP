// User Statistics Service
// Tracks user activity and provides statistics

class UserStatsService {
  constructor() {
    this.storageKey = 'foodieTracker_userStats';
    this.stats = this.loadStats();
  }

  loadStats() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultStats();
    } catch (error) {
      console.error('Failed to load user stats:', error);
      return this.getDefaultStats();
    }
  }

  getDefaultStats() {
    return {
      totalSearches: 0,
      totalPlacesViewed: 0,
      totalAIChats: 0,
      totalMenusViewed: 0,
      totalNavigations: 0,
      lastSearchDate: null,
      lastLoginDate: null,
      accountCreatedDate: null,
      searchHistory: [],
      viewedPlaces: [],
      favoriteCategories: {},
      preferredPriceRange: null,
      preferredRadius: 1000,
      loginStreak: 0,
      longestStreak: 0
    };
  }

  saveStats() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save user stats:', error);
    }
  }

  // Initialize stats for a new user
  initializeForUser(userId, createdDate = new Date().toISOString()) {
    if (!this.stats.accountCreatedDate) {
      this.stats.accountCreatedDate = createdDate;
    }
    this.stats.userId = userId;
    this.saveStats();
  }

  // Record a search
  recordSearch(searchParams) {
    this.stats.totalSearches++;
    this.stats.lastSearchDate = new Date().toISOString();
    
    // Track search history (keep last 50)
    this.stats.searchHistory.unshift({
      ...searchParams,
      timestamp: new Date().toISOString()
    });
    if (this.stats.searchHistory.length > 50) {
      this.stats.searchHistory = this.stats.searchHistory.slice(0, 50);
    }

    // Track preferred settings
    if (searchParams.radius) {
      this.stats.preferredRadius = searchParams.radius;
    }
    if (searchParams.priceRange && searchParams.priceRange !== 'all') {
      this.stats.preferredPriceRange = searchParams.priceRange;
    }

    this.saveStats();
  }

  // Record viewing a place
  recordPlaceView(place) {
    this.stats.totalPlacesViewed++;
    
    // Track viewed places (keep last 30)
    const viewRecord = {
      placeId: place.place_id,
      name: place.name,
      types: place.types,
      timestamp: new Date().toISOString()
    };
    
    this.stats.viewedPlaces.unshift(viewRecord);
    if (this.stats.viewedPlaces.length > 30) {
      this.stats.viewedPlaces = this.stats.viewedPlaces.slice(0, 30);
    }

    // Track favorite categories
    if (place.types) {
      place.types.forEach(type => {
        this.stats.favoriteCategories[type] = (this.stats.favoriteCategories[type] || 0) + 1;
      });
    }

    this.saveStats();
  }

  // Record AI chat usage
  recordAIChat() {
    this.stats.totalAIChats++;
    this.saveStats();
  }

  // Record menu view
  recordMenuView() {
    this.stats.totalMenusViewed++;
    this.saveStats();
  }

  // Record navigation
  recordNavigation() {
    this.stats.totalNavigations++;
    this.saveStats();
  }

  // Record login
  recordLogin() {
    const today = new Date().toDateString();
    const lastLogin = this.stats.lastLoginDate ? new Date(this.stats.lastLoginDate).toDateString() : null;
    
    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        // Consecutive day login
        this.stats.loginStreak++;
        if (this.stats.loginStreak > this.stats.longestStreak) {
          this.stats.longestStreak = this.stats.loginStreak;
        }
      } else if (lastLogin !== today) {
        // Streak broken
        this.stats.loginStreak = 1;
      }
    } else {
      this.stats.loginStreak = 1;
    }
    
    this.stats.lastLoginDate = new Date().toISOString();
    this.saveStats();
  }

  // Get all stats
  getStats() {
    return { ...this.stats };
  }

  // Get top categories
  getTopCategories(limit = 5) {
    const categories = Object.entries(this.stats.favoriteCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, count]) => ({
        category: category.replace(/_/g, ' '),
        count
      }));
    return categories;
  }

  // Get recent activity
  getRecentActivity(limit = 10) {
    const activities = [];
    
    // Add recent searches
    this.stats.searchHistory.slice(0, 5).forEach(search => {
      activities.push({
        type: 'search',
        description: search.query || search.type || 'Nearby search',
        timestamp: search.timestamp
      });
    });
    
    // Add recent place views
    this.stats.viewedPlaces.slice(0, 5).forEach(place => {
      activities.push({
        type: 'view',
        description: place.name,
        timestamp: place.timestamp
      });
    });
    
    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Get account age in days
  getAccountAgeDays() {
    if (!this.stats.accountCreatedDate) return 0;
    const created = new Date(this.stats.accountCreatedDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Clear all stats
  clearStats() {
    this.stats = this.getDefaultStats();
    this.saveStats();
  }
}

export default new UserStatsService();

