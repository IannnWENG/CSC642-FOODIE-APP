class SearchHistoryService {
  constructor() {
    this.storageKey = 'restaurant_recommender_search_history';
    this.history = this.loadHistory();
    this.maxHistoryItems = 20;
  }

  loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  addSearch(searchParams, results) {
    const searchRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      params: {
        type: searchParams.type,
        radius: searchParams.radius,
        priceRange: searchParams.priceRange
      },
      resultsCount: results ? results.length : 0,
      location: searchParams.location
    };

    // Remove duplicate searches (same parameters)
    this.history = this.history.filter(record => 
      !this.isSameSearch(record.params, searchRecord.params)
    );

    // Add to beginning
    this.history.unshift(searchRecord);

    // Limit history records count
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }

    this.saveHistory();
  }

  isSameSearch(params1, params2) {
    return (
      params1.type === params2.type &&
      params1.radius === params2.radius &&
      params1.priceRange === params2.priceRange
    );
  }

  getHistory() {
    return [...this.history];
  }

  getRecentSearches(limit = 5) {
    return this.history.slice(0, limit);
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  removeSearch(searchId) {
    this.history = this.history.filter(record => record.id !== searchId);
    this.saveHistory();
  }

  // Get search statistics
  getStats() {
    const stats = {
      totalSearches: this.history.length,
      mostSearchedType: this.getMostSearchedType(),
      averageResults: this.getAverageResults(),
      lastSearch: this.history[0]?.timestamp
    };

    return stats;
  }

  getMostSearchedType() {
    const typeCounts = {};
    this.history.forEach(record => {
      const type = record.params.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, 'restaurant'
    );
  }

  getAverageResults() {
    if (this.history.length === 0) return 0;
    const total = this.history.reduce((sum, record) => sum + record.resultsCount, 0);
    return Math.round(total / this.history.length);
  }

  // Format timestamp
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US');
  }

  // Get type name in English
  getTypeName(type) {
    const typeNames = {
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      meal_takeaway: 'Takeaway',
      food: 'Food',
      bakery: 'Bakery'
    };
    return typeNames[type] || type;
  }

  // Get price range name in English
  getPriceRangeName(priceRange) {
    const priceNames = {
      all: 'Any',
      low: 'Budget',
      medium: 'Moderate',
      high: 'Expensive'
    };
    return priceNames[priceRange] || priceRange;
  }
}

export default new SearchHistoryService();
