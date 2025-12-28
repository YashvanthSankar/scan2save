// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqYA09yohnkcNl7W6RLqlkWpsV3P3rlNI",
  authDomain: "scan2save-a64d8.firebaseapp.com",
  projectId: "scan2save-a64d8",
  storageBucket: "scan2save-a64d8.firebasestorage.app",
  messagingSenderId: "182065627526",
  appId: "1:182065627526:web:656996809698762e20ec07",
  measurementId: "G-VGKC0TNLXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;