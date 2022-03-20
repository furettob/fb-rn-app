const functions = require('firebase-functions').region('europe-west1')
const checker =  require('./checker')
const users = require('./users')
const app = require('./app')

const db = app.admin.database()

const entity = "goal"
const entities = "goals"
const basePath = "goals/"

// addGoalWithId
const addGoalWithIdDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    if (
        request.body.goalId
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing goalId param in request"}); // 400 Bad Request
        return false;
    }
}
exports.addGoalWithId = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && addGoalWithIdDataChecker(request, response)) {
            const {goalId} = request.body
            const target = request.body.data || {}
            const elemAlreadyPresent = await db.ref(`${basePath}${goalId}`).once("value")
            if (elemAlreadyPresent) {
                response.status(403).send(
                    {error:
                            `A ${entity} in ${basePath} with id "${goalId}" is already present, thus cannot be created`
                    }); // forbidden
            }
            await db.ref(`${basePath}${goalId}`).set(Object.assign(target, {createdAt: Date.now()}))
            response.status(200).send({
                data: `Successfully created ${entity} in ${basePath} with id "${goalId}"`
            });
            return goalId
        }
    } catch (e) {
        response.status(500).send({error: e});
        return null
    }
});


// addGoal
const addGoalDataChecker = (request, response) => {
    if (!checker.checkDataPostReq(
        request,
        response,
        [
            "data",
            "data.uid",
            "data.name",
            "data.reminder",
            "data.hardReminder",
            "data.type",
            "data.typeData"
        ])) {
        return false
    }
    return true
}
exports.addGoal = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && addGoalDataChecker(request, response)) {
            const elemIdRef = db.ref(`${basePath}`).push()
            const target = request.body.data || {}

            const user = await users.getUserCRUD(request.body.data.uid)
            if (!user) {
                response.status(404).send({
                    data: `User with id ${request.body.data.uid} not found, deleting goal with temp id ${elemIdRef.key}`
                });
            }
            users.addGoalToUser(request.body.data.uid, elemIdRef.key)
            await elemIdRef.set(Object.assign(target, {createdAt: Date.now()}))
            response.status(200).send({
                data: `Successfully created ${entity} in ${basePath} with id ${elemIdRef.key}`
            });
            return elemIdRef
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});


// getUser
const getGoalDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    var x = !!request.body.goalId
    if (
       x
    ) {
        return true;
    } else {
        response.status(400).send({"error":"missing goalId param in request"}); // 400 Bad Request
        return false;
    }
}
exports.getGoal =  functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && getGoalDataChecker(request, response)) {
            const {goalId} = request.body
            const res = await admin.database().ref(`${basePath}${goalId}`).once('value');
            response.status(200).send({data: res});
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
})


// getGoalList
const getGoalListDataChecker = (request, response) => {
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
exports.getGoalList =  functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && getGoalListDataChecker(request, response)) {
            const res = await admin.database().ref(`${basePath}`).once('value')
            response.status(200).send({data: res})
        }
    } catch (e) {
        response.status(500).send({error: e})
    }
})


// updateGoal
const updateGoalDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end() // 400 Bad Request
        return false;
    }
    if (
        !!request.body.goalId &&
        !!request.body.updatedData
    ) {
        return true
    } else {
        response.status(400).send({"error":"missing uid or updatedData param in request"}) // 400 Bad Request
        return false
    }
}
exports.updateGoal = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && updateGoalDataChecker(request, response)) {
            const {goalId} = request.body
            const updatedData = request.body.updatedData
            await db.ref(`${basePath}${goalId}`).update(updatedData)
            response.status(200).send({
                data: `Successfully updated ${entity} with id ${goalId}`
            });
            return goalId
        }
    } catch (e) {
        response.status(500).send({error: e});
    }
});


// deleteGoal
const deleteGoalDataChecker = (request, response) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false
    }
    if (
        request.body.goalId
    ) {
        return true
    } else {
        response.status(400).send({"error":"missing uid param in request"}); // 400 Bad Request
        return false
    }
}
exports.deleteGoal = functions.https.onRequest(async (request, response) => {
    try {
        if(checker.checkAuthorizedPostReq(request, response) && deleteGoalDataChecker(request, response)) {
            const {goalId} = request.body
            await db.ref(`${basePath}${goalId}`).set(null) // delete() does not work
            response.status(200).send({
                data: `Successfully deleted ${entity} with id ${goalId}`
            })
            return goalId
        }
    } catch (e) {
        response.status(500).send({error: e})
    }
})
