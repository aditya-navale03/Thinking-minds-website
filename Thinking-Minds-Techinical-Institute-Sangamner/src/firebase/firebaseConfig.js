import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlnrlPrtKTd_FGU8Gyre_31500499avh8",
  authDomain: "thinking-minds-db.firebaseapp.com",
  projectId: "thinking-minds-db",
  storageBucket: "thinking-minds-db.appspot.com",
  messagingSenderId: "1008436516026",
  appId: "1:1008436516026:web:b2e7a33f55b705fc02de83",
  measurementId: "G-LPPQK5MRH5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
