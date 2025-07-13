
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "online-chess-7eec9.firebaseapp.com",
  projectId: "online-chess-7eec9",
  storageBucket: "online-chess-7eec9.firebasestorage.app",
  messagingSenderId: "558343458422",
  appId: "1:558343458422:web:2a8ca36ed63747514ad957"
};


const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
const db=getFirestore(app);


export {app,auth,db}


