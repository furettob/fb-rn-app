// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArEHqy173PRbeEor_lwWCbAgFgCnkzCAs",
  authDomain: "fb-goal-buddy.firebaseapp.com",
  projectId: "fb-goal-buddy",
  storageBucket: "fb-goal-buddy.appspot.com",
  messagingSenderId: "802169792867",
  appId: "1:802169792867:web:a24c07a96a903351f1cb56"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { app, auth };