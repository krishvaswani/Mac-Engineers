// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBuDg_EbuxclKzh-4ePk4cEBTI_jds1jHY",
  authDomain: "mac-engineers.firebaseapp.com",
  projectId: "mac-engineers",
  storageBucket: "mac-engineers.firebasestorage.app",
  messagingSenderId: "618659866936",
  appId: "1:618659866936:web:314a805d10873d3c71f9cd",
  measurementId: "G-DGBP30PE0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);