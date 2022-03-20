require ("dotenv").config()
console.log("\n\nTARGET_ENV: ", process.env.TARGET_ENV)

const firebaseConfig = require("../firebaseConfig_"+process.env.TARGET_ENV+".js")

console.log("FFFF... ", firebaseConfig)

const admin = require('firebase-admin')
admin.initializeApp(firebaseConfig)

console.log("\n\nADMIN: ", admin)

module.exports = {
    admin
}