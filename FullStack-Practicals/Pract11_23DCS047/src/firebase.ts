import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZSu5JgB__IvZtIAgKsUZK0JRM_DjKyFg",
  authDomain: "firstproject-aa16d.firebaseapp.com",
  projectId: "firstproject-aa16d",
  storageBucket: "firstproject-aa16d.firebasestorage.app",
  messagingSenderId: "176964393368",
  appId: "1:176964393368:web:87a5980a9b74ffea80f3ed",
  measurementId: "G-92N7RFM5Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
