const firebaseConfig = {
    apiKey: "AIzaSyArEHqy173PRbeEor_lwWCbAgFgCnkzCAs",
    authDomain: "fb-goal-buddy.firebaseapp.com",
    databaseURL: "https://fb-goal-buddy-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fb-goal-buddy",
    storageBucket: "fb-goal-buddy.appspot.com",
    messagingSenderId: "802169792867",
    appId: "1:802169792867:web:a24c07a96a903351f1cb56"
}

const admin = require('firebase-admin')
admin.initializeApp(firebaseConfig)

console.log("ADMIN: ", admin)

module.exports = {
    admin
}