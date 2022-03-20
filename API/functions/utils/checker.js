const app = require('./app')

const config = {
    apiKeyList: ["ajeje", "stocazzo"]
}

const checkGetReq = (request, response) => {
    if (request.method === 'GET') {
        return true;
    } else {
        response.status(405).send({"error":"wrong http method: " + request.method}); // 405 Method not allowed
        return false;
    }
}

const checkPostReq = (request, response) => {
    if (request.method === 'POST') {
        return true;
    } else {
        response.status(405).send({"error":"wrong http method: " + request.method}); // 405 Method not allowed
        return false;
    }
}

// Checks that it is a POST and that has correct API key
// TODO: add a part that distinguish between API keys
exports.checkAuthorizedPostReq = (request, response) => {
    if (!checkPostReq(request, response)) {
        return false
    }
    const x_api_key = request && request.headers ? request.headers['x-api-key'] : undefined;
    if(
        // the key is in the list of authorized keys
        config.apiKeyList.indexOf(x_api_key) > -1
    ) {
        return true
    } else {
        console.log("Wrong x-api-key: " + x_api_key)
        response.status(401).send({"error":"Wrong x-api-key: " + x_api_key}) // 401 Unauthorized
        return false
    }
}

// Checks that this specific firebase user has correct claims
// The 'claim'  the <functionName>DataChecker function
exports.checkAuthorizedUser = async (request, response, claims) => {
    const accessToken = request && request.headers ? request.headers['access-token'] : undefined
    if (!accessToken || typeof accessToken !== "string" ) {
        console.warn("Unset access-token in header: " + accessToken)
        response.status(401).send({"error":"Unset access-token in header: " + accessToken}) // 401 Unauthorized
        return false
    }
    let decodedIdToken = await app.admin.auth().verifyIdToken(accessToken)

    //console.log("Trying to decode accessToken: ", accessToken)
    if(!decodedIdToken) {
        const em = "Wrong or unset access-token in header: " + accessToken
        console.warn(em)
        response.status(401).send({"error":em}) // 401 Unauthorized
        return false
    }

    console.log("Decoded id token: ", decodedIdToken)

    if (claims) {
        for (let i in claims) {
            console.log(".....1")
            if (decodedIdToken[claims[i]]) {
                console.log("Found role: ", claims[i])
                return true
            }
        }
        const em = `User '${decodedIdToken.uid}' needs to become '${claims.join("', or '")}' to use this function`
        console.warn(em)
        response.status(401).send({"error":em}) // 401 Unauthorized
        return false
    }
    console.log(".....2")
    return true
}

// Checks the presence of request.body and required data.
// More logic (eg: request.body.id must be a number > 0) can be added to the <functionName>DataChecker function
exports.checkDataPostReq = (request, response, requiredDataList) => {
    if (!request || !request.body) {
        response.status(400).end(); // 400 Bad Request
        return false;
    }
    for (let i in requiredDataList) {
        const requiredData = requiredDataList[i]
        const requiredDataPath = requiredData.split(".")
        let item = request.body
        for (let i in requiredDataPath) {
            const key = requiredDataPath[i]
            item = item[key]
            if (!item) {
                response.status(400).send(
                    {"error":`missing ${requiredData} param in request - stopped at ${key}`}); // 400 Bad Request
                return false;
            }
        }
    }
    return true
}