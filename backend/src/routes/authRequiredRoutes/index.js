const {router: userRoute} = require('./user.js');
const { Router } = require('express');
const Authentication = require('../../middleware/Authentication.js');

const router = Router()

//auth middleware
router.use(Authentication.authToken)

//routes
router.use('/user', userRoute)

module.exports = { router }

