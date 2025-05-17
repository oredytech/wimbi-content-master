
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD0RYA84nT5M2kAA1SDrlc2Bxjm1lStsP0",
  authDomain: "wimbimaster-f7d57.firebaseapp.com",
  projectId: "wimbimaster-f7d57",
  storageBucket: "wimbimaster-f7d57.firebasestorage.app",
  messagingSenderId: "1064535638013",
  appId: "1:1064535638013:web:38ed0a9feb3c96be0da394",
  measurementId: "G-W8GY07K5FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
