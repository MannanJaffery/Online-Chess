
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "online-chess-7eec9.firebaseapp.com",
  projectId: "online-chess-7eec9",
  storageBucket: "online-chess-7eec9.firebasestorage.app",
  messagingSenderId: "558343458422",
  appId: "1:558343458422:web:2a8ca36ed63747514ad957"
};


const app = initializeApp(firebaseConfig);