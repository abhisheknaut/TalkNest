import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsgaubMYtSDR1PUo0HVJ1GKM-YAJ1pXoE",
  authDomain: "chatapp-5c775.firebaseapp.com",
  projectId: "chatapp-5c775",
  storageBucket: "chatapp-5c775.firebasestorage.app",
  messagingSenderId: "1042839299105",
  appId: "1:1042839299105:web:a06b55df20cbe30018ef60",
  measurementId: "G-9LBWSD32FT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
