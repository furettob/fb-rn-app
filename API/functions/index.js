// GENERIC CRUD AND UTILS
const crud =  require('./utils/crud')
exports.setCustomClaims = crud.setCustomClaims

// GOAL ENTITY
const goals =  require('./utils/goals')
exports.addGoal = goals.addGoal
exports.addGoalWithId = goals.addGoalWithId
exports.getGoal = goals.getGoal
exports.getGoalList = goals.getGoalList
exports.updateGoal = goals.updateGoal
exports.deleteGoal = goals.deleteGoal

// USER ENTITY
const users =  require('./utils/users')
exports.addUser = users.addUser
exports.addUserWithId = users.addUserWithId
exports.getUser = users.getUser
exports.getUserList = users.getUserList
exports.updateUser = users.updateUser
exports.deleteUser = users.deleteUser