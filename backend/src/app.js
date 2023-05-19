//importing
const express = require('express');
const cookieParser = require('cookie-parser')
const { signInRoute, loginRoute, userRoute } = require('./routes')
const { corsAllowances, cookieSettings, errorHandler} = require('./middleware')
const { NotFoundError } = require('./CustomErrors/NotFoundError.js');
const Authentication = require('./middleware/Authentication.js');
const { sendOKResponse } = require('./controllers/utils');

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

//Authentication middleware
app.use(Authentication.authToken)

//routes that require auth
app.use('/user', userRoute)

app.get('/test', (req, res) => sendOKResponse(res, { message: 'tudo ok até aqui' }))

//error 404 route - for now only applied for routes with auth required
app.get('/:anything', (req, res, next) => next(new NotFoundError()))


//error handling middleware
app.use(errorHandler)

module.exports = app;