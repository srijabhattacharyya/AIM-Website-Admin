// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-4222547288-13ed5",
  "appId": "1:384414839192:web:0061cc71decf2dfbeefbed",
  "storageBucket": "studio-4222547288-13ed5.firebasestorage.app",
  "apiKey": "AIzaSyAv62aSJgcQrqs8X6KPm4lV5E2Q_o7b-Oc",
  "authDomain": "studio-4222547288-13ed5.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "384414839192"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
