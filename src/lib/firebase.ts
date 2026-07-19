import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-studio-applet-webapp-105ba",
  appId: "1:120664071376:web:c136ac56bea922e07092d5",
  apiKey: "AIzaSyDkw8FqY2qNz7nA6HfzvCKs0uMAGGO2Oh4",
  authDomain: "ai-studio-applet-webapp-105ba.firebaseapp.com",
  storageBucket: "ai-studio-applet-webapp-105ba.firebasestorage.app",
  messagingSenderId: "120664071376"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-digimarktbd-809b0803-e513-4cac-b196-2ecffa5af32f");
