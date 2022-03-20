import axios from "axios"

const x_api_key = "ajeje"
const baseUrlLocal = "http://localhost:3000/fb-goal-buddy/europe-west1"
const baseUrlRemote = "https://europe-west1-fb-goal-buddy.cloudfunctions.net"
const baseUrl = baseUrlLocal

const getUserList = async (user) => {
    //console.log("Starting api call getGoalList with user:  ", user)

    //const idToken = await user.getIdToken(/* forceRefresh */ false)
    //console.log("Retrieved: ", idToken)


    let idToken = user["Aa"]

    console.log("\n\nI'm usin token: ", idToken)
    console.log(`Now is  ${Math.floor(Date.now()/1000)} - token expiration is::: ${user?.h?.b?.a}`)
    console.log(`Now is  ${new Date(Date.now())} - token expiration is::: ${new Date(user?.h?.b?.a*1000)}`)

    // If token will expire in the next 10 minutes, refresh it
    if (Math.floor(Date.now()/1000) + 600 > user?.h?.b?.a) {
        console.log("Token will expire in less than 10 min: " + (user?.h?.b?.a - Math.floor(Date.now()/1000)) + " seconds")
        idToken = await user.getIdToken(/* forceRefresh */ true)
    } else {
        console.log("No need to refresh token")
    }

    if (Math.floor(Date.now()/1000) < user?.h?.b?.a) {
        console.log("Token will expire in " + (user?.h?.b?.a - Math.floor(Date.now()/1000)) + " seconds")
    } else {
        console.log("Token EXPIRED " + (Math.floor(Date.now()/1000) - user?.h?.b?.a) + " seconds ago")
    }
    const axios_params = {
        url: baseUrl + "/getUserList",
        headers: {
            "x-api-key": x_api_key,
            "access-token": idToken
        },
        method: "post"
    }
    const activities = await axios(axios_params)
        .then( r => {
            console.log("RRRRR: ", r)
            return r.data
        })
        .catch(e => {
            console.log( "Error : ", e);
            return null
        })
    console.log("Received activities: ", activities)
    return activities
}

export {getUserList}