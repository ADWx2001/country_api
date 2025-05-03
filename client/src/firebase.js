// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeKjWvbBrZ90qtZvdvsiycWKL6mAVjV-g",
    authDomain: "ob-cakes.firebaseapp.com",
    projectId: "ob-cakes",
    storageBucket: "ob-cakes.firebasestorage.app",
    messagingSenderId: "991150029195",
    appId: "1:991150029195:web:d9a27088c8cc88e90e178e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };