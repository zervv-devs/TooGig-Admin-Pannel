// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ added

const firebaseConfig = {
  apiKey: "AIzaSyBthl-JsJubXDAsFqweqJ70TujLZ6kqhB4",
  authDomain: "toogig-12.firebaseapp.com",
  projectId: "toogig-12",
  storageBucket: "toogig-12.firebasestorage.app",
  messagingSenderId: "15270869448",
  appId: "1:15270869448:web:070ddccd29e0c5c54128fd",
  measurementId: "G-H3QHB8PRNG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ make sure this is here
