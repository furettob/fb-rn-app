const functions = require('firebase-functions').region('europe-west1')
const checker =  require('./checker')
const cors = require('cors')({origin: true})
const app = require('./app')

const db = app.admin.database()

const entity = "user"
const entities = "users"
const basePath = "users/"

// addUserWithId
const addUserWithIdDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    if (
        request.body.uid
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing uid param in request"}); // 400 Bad Request
        return false;
    }
}
exports.addUserWithId = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && addUserWithIdDataChecker(request, response)) {
            const {uid} = request.body
            const target = request.body.data || {}
            const elemAlreadyPresent = await db.ref(`${basePath}${uid}`).once("value")
            if (!!elemAlreadyPresent) {
                response.status(403).send(
                    {error:
                            `A ${entity} in ${basePath} with id ${uid} is already present, thus cannot be created`
                    }); // forbidden
            }
            await db.ref(`${basePath}${uid}`).set(Object.assign(target, {createdAt: Date.now()}))
            response.status(200).send({
                data: `Successfully created ${entity} in ${basePath} with id ${uid}`
            });
            return uid
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});


// addUser
const addUserDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    if (
        request.body
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing param in request"}); // 400 Bad Request
        return false;
    }
}
exports.addUser = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && addUserDataChecker(request, response)) {
            const uidRef = db.ref(`${basePath}`).push()
            const target = request.body.data || {}
            await uidRef.set(Object.assign(target, {createdAt: Date.now()}))
            response.status(200).send({
                data: `Successfully created ${entity} in ${basePath} with id ${uidRef.key}`
            });
            return uidRef
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});


// getUser
const getUserDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    if (
        !!request.body.uid
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing uid param in request"}); // 400 Bad Request
        return false;
    }
}
exports.getUser =  functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && getUserDataChecker(request, response)) {
            const {uid} = request.body
            const res = await this.getUserCRUD(uid)
            response.status(200).send({data: res});
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
})

exports.getUserCRUD = async (uid) => {
    return await crud.getDoc(`${basePath}${uid}`)
}

exports.addGoalToUser = async (uid, goalId) => {
    const ref = await db.ref(`${basePath}${uid}/goals/${goalId}`).set(
        {
            "active":true,
            "createdAt": Date.now()
        });
    return ref.val()
}

// getUserList
const getUserListChecker = async (request, response) => {
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

    return isUserAuthorized
}
exports.getUserList =  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const proceed = await getUserListChecker(request, response)
            if (proceed) {
                const res = await db.ref(`${basePath}`).once('value');
                response.status(200).send({data: res});
            }
        } catch (e) {
            response.status(500).send({error: e});
        }
    })
})

// updateUser
const updateUserDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    if (
        !!request.body.uid &&
        !!request.body.updatedData
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing uid or updatedData param in request"}); // 400 Bad Request
        return false;
    }
}
exports.updateUser = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && updateUserDataChecker(request, response)) {
            const {uid} = request.body
            const updatedData = request.body.updatedData
            const userUpdated = await crud.updateDoc(`${basePath}${uid}`, uid, updatedData)
            if (!userUpdated) {
                response.status(404).send({
                    data: `There is no ${entity} with id ${uid} in the ${basePath} path`
                });
            } else {
                response.status(200).send({
                    data: `Successfully updated ${entity} with id ${uid}`
                });
            }
            return updatedData
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});

// deleteUser
const deleteUserDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false
    }
    if (
        !!request.body.uid
    ) {
        return true
    } else {
        response.status(400).send({"error":"missing uid param in request"}); // 400 Bad Request
        return false
    }
}
exports.deleteUser = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && deleteUserDataChecker(request, response)) {
            const {uid} = request.body
            await db.ref(`users/www`).set(null) // delete() does not work
            response.status(200).send({
                data: `Successfully deleted ${entity} with id ${uid}`
            });
            return uid
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});
