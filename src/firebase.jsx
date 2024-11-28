import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Your Firebase config (get this from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDzD8zMLLVCdHqI64HVyz9wgBKK-NadCV4",
  authDomain: "books-2dfe1.firebaseapp.com",
  databaseURL:'https://books-2dfe1-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: "books-2dfe1",
  storageBucket: "books-2dfe1.appspot.com",
  messagingSenderId: "814619358493",
  appId: "1:814619358493:web:43718924c797501b971df4",
  measurementId: "G-J61F0VFZ8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export { auth, db };