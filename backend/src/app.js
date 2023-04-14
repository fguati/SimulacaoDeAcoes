//importing
const express = require('express');
const cookieParser = require('cookie-parser')

const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')
const {router: userRoute} = require('./routes/user.js')

const { corsAllowances } = require('./middleware/corsAllowances.js');
const { cookieSettings } = require('./middleware/cookiesSettings.js');
const { errorHandler } = require('./middleware/errorHandler.js');
const { NotFoundError } = require('./CustomErrors/NotFoundError.js');
const Authentication = require('./middleware/Authentication.js');

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

//routes that require auth
app.use(Authentication.authToken)
app.use('/user', userRoute)

//error 404 route - for now only applied for routes with auth required
app.get('/:anything', (req, res, next) => next(new NotFoundError()))

//error handling middleware
app.use(errorHandler)

module.exports = app;