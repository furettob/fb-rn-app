require ("dotenv").config()

const firebaseConfig = require("../firebaseConfig_" + process.env.TARGET_ENV + ".js")

console.log("firebaseConfig: ", firebaseConfig)

const admin = require('firebase-admin')
admin.initializeApp(firebaseConfig)

console.log("\n\nADMIN: ", admin)

module.exports = {
    admin
}