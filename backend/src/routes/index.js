const {router: signInRoute} = require('./register.js')
const {router: loginRoute} = require('./login.js')
const {router: userRoute} = require('./user.js')

module.exports = {
    signInRoute,
    loginRoute,
    userRoute
}