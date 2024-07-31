import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const APIKEY = process.env.API_KEY;
const AUTHDOMAIN = process.env.AUTHDOMAIN;
const STORAGEBUCKET = process.env.STORAGEBUCKET;
const MESSAGINGSENDERID = process.env.MESSAGINGSENDERID;
const APPID = process.env.APPID;
const MEASUREMENTID = process.env.MEASUREMENTID;

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: "pantry-tracker-39683",
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// const firestore = getFirestore();

export { db };
