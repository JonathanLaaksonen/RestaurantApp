import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyATo_i0UQsxNG0AtUV4wQAgR3EsPz8qSZ8",
    authDomain: "restaurantapp-6bd29.firebaseapp.com",
    databaseURL: "https://restaurantapp-6bd29-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "restaurantapp-6bd29",
    storageBucket: "restaurantapp-6bd29.appspot.com", 
    messagingSenderId: "3668278785",
    appId: "1:3668278785:web:013e3f4cfd4fafcd264a00",
    measurementId: "G-1PZ2LHCY32"
};

// Initialize Firebase only if no apps are already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Realtime Database
export const db = getDatabase(app);
