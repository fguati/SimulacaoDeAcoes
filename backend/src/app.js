const express = require('express');
const cookieParser = require('cookie-parser')

const {router: userRoute} = require('./routes/user.js');
const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')

const Authentication = require('./middleware/Authentication.js');
const { corsAllowances } = require('./middleware/corsAllowances.js');
const { cookieSettings } = require('./middleware/cookiesSettings.js');

const app = express();

app.use(corsAllowances)
app.use(express.json())
app.use(cookieParser())
app.use(cookieSettings)

app.use('/login', loginRoute)
app.use('/register', signInRoute)

app.use(Authentication.authToken)

app.use('/user', userRoute)

module.exports = app;