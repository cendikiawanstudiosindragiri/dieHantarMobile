
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjPmukz7E5mKLP8_BVN7cMxErnQMmKqdU",
  authDomain: "diehantarmobile-f499b.firebaseapp.com",
  projectId: "diehantarmobile-f499b",
  storageBucket: "diehantarmobile-f499b.appspot.com",
  messagingSenderId: "699024660110",
  appId: "1:699024660110:web:d7c27a9d2cc003f8c79bdf",
  measurementId: "G-6737TJ61P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
