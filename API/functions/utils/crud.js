const functions = require('firebase-functions').region('europe-west1')
const cors = require('cors')({origin: true})
const checker =  require('./checker')
const app = require('./app')

const db = app.admin.database()

exports.getDoc = async (path) => {
    const ref = await db.ref(path).once('value');
    return ref.val()
}

exports.updateDoc = async (basePath, uid, updatedData) => {
    const res = await this.getDoc(`${basePath}${uid}`)
    if (!!res) {
        await db.ref(`${basePath}${uid}`).update(updatedData)
        return uid
    }
    return null
}

async function setCustomClaimsDataChecker(request, response) {
    if (!checker.checkAuthorizedPostReq(request, response)) {
        return false
    }
    if (!checker.checkDataPostReq(
        request,
        response,
        [])) {
        return false
    }
    const isUserAuthorized = await checker.checkAuthorizedUser(request, response)
    if (!isUserAuthorized) {
        return false
    }
}

exports.setCustomClaims = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const requestOk = setCustomClaimsDataChecker(request, response)
        if (requestOk) {
            const userToBeChanged = await app.admin.auth().getUser(request.body.uid)
            console.log("userToBeChanged is " + userToBeChanged.uid + ", with claims: ", userToBeChanged.customClaims)
            const newClaims = Object.assign({},
                userToBeChanged.customClaims,
                request.body.claims,
                {sbcc:true})
            for (var i in request.body.deleteClaims) {
                delete newClaims[request.body.deleteClaims[i]]
            }
            await app.admin.auth().setCustomUserClaims(
                userToBeChanged.uid,
                newClaims
        )
            console.log("userToBeChanged claims after change: ", userToBeChanged.customClaims)
            response.status(200).send(
                {"data": {
                        "msg":
                            "Added " + (JSON.stringify(request.body.claims)) +
                            " to " + userToBeChanged.uid
                    }
                })
        }
        return true
    })
})

exports.setCustomClaims = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const requestOk = setCustomClaimsDataChecker(request, response)
        if (requestOk) {
            const userToBeChanged = await app.admin.auth().getUser(request.body.uid)
            console.log("userToBeChanged is " + userToBeChanged.uid + ", with claims: ", userToBeChanged.customClaims)
            const newClaims = Object.assign({},
                userToBeChanged.customClaims,
                request.body.claims,
                {sbcc:true})
            for (var i in request.body.deleteClaims) {
                delete newClaims[request.body.deleteClaims[i]]
            }
            await app.admin.auth().setCustomUserClaims(
                userToBeChanged.uid,
                newClaims
            )
            console.log("userToBeChanged claims after change: ", userToBeChanged.customClaims)
            response.status(200).send(
                {"data": {
                        "msg":
                            "Added " + (JSON.stringify(request.body.claims)) +
                            " to " + userToBeChanged.uid
                    }
                })
        }
        return true
    })
})