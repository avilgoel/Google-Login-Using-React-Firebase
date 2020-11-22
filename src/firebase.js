import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA8-YbadX_WSkqI0F8PSAzpgLNCV-lHhtk",
    authDomain: "simple-login-page-bd57b.firebaseapp.com",
    databaseURL: "https://simple-login-page-bd57b.firebaseio.com",
    projectId: "simple-login-page-bd57b",
    storageBucket: "simple-login-page-bd57b.appspot.com",
    messagingSenderId: "331576267497",
    appId: "1:331576267497:web:7bcfb1d5b29d196f921678",
    measurementId: "G-7LJ5X3DSHY"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  export default firebase;