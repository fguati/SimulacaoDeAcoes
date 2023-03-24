//importing
const express = require('express');
const cookieParser = require('cookie-parser')

const {router: userRoute} = require('./routes/user.js');
const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')

const Authentication = require('./middleware/Authentication.js');
const { corsAllowances } = require('./middleware/corsAllowances.js');
const { cookieSettings } = require('./middleware/cookiesSettings.js');

//instantiate app
const app = express();

//basic setup for use of JSON, cookies and CORS
app.use(corsAllowances)
app.use(express.json())
app.use(cookieParser())
app.use(cookieSettings)

//routes that don't require auth
app.use('/login', loginRoute)
app.use('/register', signInRoute)

//auth middleware
app.use(Authentication.authToken)

//routes that require auth
app.use('/user', userRoute)

module.exports = app;