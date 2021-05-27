import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

var firebaseConfig = {
    apiKey: "AIzaSyC11-tLyKZVdwZMBjQ_smnFAxie5bRtLUY",
    authDomain: "choice-web.firebaseapp.com",
    projectId: "choice-web",
    storageBucket: "choice-web.appspot.com",
    messagingSenderId: "510661608123",
    appId: "1:510661608123:web:7df7d83686f2b07f12df9e",
    measurementId: "G-GCJ5E478TX",
};

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
export const firebaseInstance = firebase;
export const dbService = firebase.firestore();
export const analytics = firebase.analytics();
