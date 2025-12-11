import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("API KEY PROD:", import.meta.env.VITE_FIREBASE_API_KEY);


// Henter Firebase-config fra miljøvariabler
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
};

// Init Firebase App
export const firebaseApp = initializeApp(firebaseConfig);

// Init Auth (brukes av AuthProvider)
export const firebaseAuth = getAuth(firebaseApp);

// Init Firestore Database (brukes av riskService, SoA, policies)
export const firebaseDb = getFirestore(firebaseApp);
