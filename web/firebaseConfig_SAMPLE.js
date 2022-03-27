// How to use this file:
// 1 - copy it in a new firebaseConfig_<ENVNAME>.js file
// 2 - fill in the right information to connect with firebase functions
// 3 - add the newly created file to .gitignore to avoid sharing protected info
// 4 - be sure that in the ./.env file the env name matches <ENVNAME>

const firebaseConfig = {
  apiKey: "THE_API_KEY",
  authDomain: "<APP_NAME>.firebaseapp.com",
  databaseURL: "https://<APP_NAME>.firebasedatabase.app",
  projectId: "<APP_NAME>",
  storageBucket: "<APP_NAME>.appspot.com",
  messagingSenderId: "<MS_NUMBER>",
  appId: "1:<MS_NMBER>:web:........",
  whatEnv: "env is sample"
}

module.exports = firebaseConfig
