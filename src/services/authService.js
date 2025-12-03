import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebaseConfig';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyListeners(user);
    });
  }

  // Add listener for auth state changes
  addAuthStateListener(listener) {
    this.authStateListeners.push(listener);
    // Immediately call with current state
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  notifyListeners(user) {
    this.authStateListeners.forEach(listener => listener(user));
  }

  // Register new user
  async register(email, password, name) {
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: name
      });

    return {
      success: true,
      user: {
          id: user.uid,
          email: user.email,
          name: name
      }
    };
    } catch (error) {
      // Convert Firebase error to user-friendly message
      const errorMessage = this.getErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }

  // Login user
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter email and password');
    }

    try {
      console.log('🔐 Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Login successful:', user.email);

    return {
      success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        }
      };
    } catch (error) {
      console.error('❌ Login error code:', error.code);
      console.error('❌ Login error message:', error.message);
      const errorMessage = this.getErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }
    
  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  // Get current user
  getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;
    
    return {
      id: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0]
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return auth.currentUser !== null;
  }

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/operation-not-allowed': 'Email/password sign-in is not enabled. Please contact support.',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'Invalid email or password',
      'auth/wrong-password': 'Invalid email or password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/invalid-login-credentials': 'Invalid email or password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/internal-error': 'An internal error occurred. Please try again',
      'auth/configuration-not-found': 'Firebase configuration error. Please contact support.'
    };

    return errorMessages[errorCode] || `An error occurred (${errorCode}). Please try again`;
  }
}

export default new AuthService();
