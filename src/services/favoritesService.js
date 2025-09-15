class FavoritesService {
  constructor() {
    this.storageKey = 'restaurant_recommender_favorites';
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  addFavorite(place) {
    const favorite = {
      ...place,
      addedAt: new Date().toISOString(),
      id: place.place_id || `favorite_${Date.now()}`
    };

    // Check if already exists
    const exists = this.favorites.find(fav => fav.place_id === place.place_id);
    if (!exists) {
      this.favorites.push(favorite);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  removeFavorite(placeId) {
    const index = this.favorites.findIndex(fav => fav.place_id === placeId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  isFavorite(placeId) {
    return this.favorites.some(fav => fav.place_id === placeId);
  }

  getFavorites() {
    return [...this.favorites];
  }

  getFavoritesByType(type) {
    return this.favorites.filter(fav => 
      fav.types && fav.types.includes(type)
    );
  }

  clearFavorites() {
    this.favorites = [];
    this.saveFavorites();
  }

  // Get favorites statistics
  getStats() {
    const stats = {
      total: this.favorites.length,
      restaurants: 0,
      cafes: 0,
      others: 0
    };

    this.favorites.forEach(fav => {
      if (fav.types) {
        if (fav.types.includes('restaurant')) {
          stats.restaurants++;
        } else if (fav.types.includes('cafe')) {
          stats.cafes++;
        } else {
          stats.others++;
        }
      }
    });

    return stats;
  }
}

export default new FavoritesService();
