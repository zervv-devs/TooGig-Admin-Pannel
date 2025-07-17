// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ added

const firebaseConfig = {
  apiKey: "AIzaSyBfqkLLys811x-OFnZOSjtZYfI69FpvBBw",
  authDomain: "fiverr-managment.firebaseapp.com",
  projectId: "fiverr-managment",
  storageBucket: "fiverr-managment.appspot.com",
  messagingSenderId: "863919386714",
  appId: "1:863919386714:web:ae7ebc45e89e7a34f1a863",
  measurementId: "G-2TSM52QLWX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ make sure this is here
