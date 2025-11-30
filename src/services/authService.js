class AuthService {
  constructor() {
    this.storageKey = 'restaurant_recommender_users';
    this.currentUserKey = 'restaurant_recommender_current_user';
    this.users = this.loadUsers();
    
    if (this.users.length === 0) {
      this.initializeTestUsers();
    }
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  initializeTestUsers() {
    const testUsers = [
      {
        id: '1',
        email: 'test@example.com',
        password: 'test123', 
        name: 'Test User',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin',
        createdAt: new Date().toISOString()
      }
    ];
    
    this.users = testUsers;
    this.saveUsers();
  }

  register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('This email is already registered');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase().trim(),
      password: password, 
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    };
  }


  login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter email and password');
    }

    const user = this.users.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const currentUser = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    try {
      localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
    } catch (error) {
      console.error('Failed to save current user:', error);
    }

    return {
      success: true,
      user: currentUser
    };
  }

  logout() {
    try {
      localStorage.removeItem(this.currentUserKey);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }
    
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(this.currentUserKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User does not exist');
    }

    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      ...updates,
      id: user.id, 
      email: user.email 
    };

    this.users[userIndex] = updatedUser;
    this.saveUsers();

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedCurrentUser = {
        ...currentUser,
        ...updates
      };
      localStorage.setItem(this.currentUserKey, JSON.stringify(updatedCurrentUser));
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    };
  }
}

export default new AuthService();

