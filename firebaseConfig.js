// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyAvW1Wscgw6leOiIzNWQ8yh-NO5CUjCEhA",
  authDomain: "personal-finance-99b81.firebaseapp.com",
  projectId: "personal-finance-99b81",
  storageBucket: "personal-finance-99b81.firebasestorage.app",
  messagingSenderId: "643998877700",
  appId: "1:643998877700:web:cc333ab04fdb8c860fcd51",
  measurementId: "G-MTW5YVNRL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export const auth=getAuth(app)