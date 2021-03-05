import firebase from 'firebase';

// the following is acquired via firebase.com  ** https://console.firebase.google.com/u/0/project/craftsbymckenna-eacde/overview
const firebaseConfig = {
    apiKey: "AIzaSyCaR4s29J_MetEeg37C4f-XhsGQuQaOYGE",
    authDomain: "craftsbymckenna-eacde.firebaseapp.com",
    projectId: "craftsbymckenna-eacde",
    storageBucket: "craftsbymckenna-eacde.appspot.com",
    messagingSenderId: "744610377005",
    appId: "1:744610377005:web:a27f841c393d5a802df7a4",
    measurementId: "G-G4V9S3FERZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();


  export const auth = firebase.auth();
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();