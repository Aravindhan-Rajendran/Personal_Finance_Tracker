import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore, doc, setDoc, collection} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpPJn_LQpSB2Jn1IWvqxgl1LG1peI7AUU",
  authDomain: "personal-finance-tracker-8eb9b.firebaseapp.com",
  projectId: "personal-finance-tracker-8eb9b",
  storageBucket: "personal-finance-tracker-8eb9b.appspot.com",
  messagingSenderId: "401063828210",
  appId: "1:401063828210:web:904ab421f99742d024ce6b",
  measurementId: "G-MPMYHM19RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };