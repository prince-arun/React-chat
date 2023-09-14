// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0fZOQfaeKnmoi31xpWyC9PIVrmy6yWZA",
  authDomain: "real-time-chat-75c6c.firebaseapp.com",
  databaseURL: "https://real-time-chat-75c6c.firebaseio.com",
  projectId: "real-time-chat-75c6c",
  storageBucket: "real-time-chat-75c6c.appspot.com",
  messagingSenderId: "745538732890",
  appId: "1:745538732890:web:7e3e9368e7543503d82963",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
