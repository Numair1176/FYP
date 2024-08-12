import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyC-ipjqqbKw8UZAWa2mQBv_J9qhpdiE29Q",
  authDomain: "mobile-activity-tracking.firebaseapp.com",
  databaseURL: "https://mobile-activity-tracking-default-rtdb.firebaseio.com",
  projectId: "mobile-activity-tracking",
  storageBucket: "mobile-activity-tracking.appspot.com",
  messagingSenderId: "1075358726602",
  appId: "1:1075358726602:web:3fa01734486ec01b4d7733",
  measurementId: "G-X8030018HX"
};

  
  firebase.initializeApp(firebaseConfig);

  const auth = getAuth(); // Call getAuth() without passing any arguments
  


  const provider = new GoogleAuthProvider();
  export {auth, signInWithPopup, provider  };