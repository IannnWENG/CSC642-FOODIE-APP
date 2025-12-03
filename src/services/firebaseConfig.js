import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb-SgqKpoHFBjnFMcfcCIwEAOIvxFzquo",
  authDomain: "foodieapp-df66c.firebaseapp.com",
  projectId: "foodieapp-df66c",
  storageBucket: "foodieapp-df66c.firebasestorage.app",
  messagingSenderId: "980920121166",
  appId: "1:980920121166:web:a93177b3f65abe636c101f",
  measurementId: "G-CH9T095N4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
