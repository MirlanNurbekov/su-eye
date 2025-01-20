// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual config values from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDNNUhJ4uwkXhQG8gHVe-klOZDfNMw-CKM",
  authDomain: "attendance-web-app-d7b6e.firebaseapp.com",
  projectId: "attendance-web-app-d7b6e",
  storageBucket: "attendance-web-app-d7b6e.firebasestorage.app",
  messagingSenderId: "97979658692",
  appId: "1:97979658692:web:7ee2a5b03a758faaf1b491",
  measurementId: "G-Y3BYT5L6RT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
