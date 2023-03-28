//importing
const express = require('express');
const cookieParser = require('cookie-parser')

const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')
const {router: authRqRoutes} = require('./routes/authRequiredRoutes')

const { corsAllowances } = require('./middleware/corsAllowances.js');
const { cookieSettings } = require('./middleware/cookiesSettings.js');
const { errorHandler } = require('./middleware/errorHandler.js');

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
app.use(authRqRoutes)

//error 404 route - not working
app.get('/:anything', (req, res) => res.status(404).send('Resource not Found'))

//error handling middleware
app.use(errorHandler)

module.exports = app;