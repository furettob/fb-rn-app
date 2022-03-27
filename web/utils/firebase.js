import firebase from 'firebase/app';
import 'firebase/auth'
import getEnvVars from '../environment';
const { TARGET_ENV } = getEnvVars();

const firebaseConfig = require("../firebaseConfig_" + TARGET_ENV + ".js")

// console.log("firebaseConfig: ", firebaseConfig)

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { app, auth };