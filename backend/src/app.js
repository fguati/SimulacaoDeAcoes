const express = require('express');
const cookieParser = require('cookie-parser')

const {router: userRoute} = require('./routes/user.js');
const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')

const Authentication = require('./middleware/Authentication.js')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return next()
})
app.use(express.json())
app.use(cookieParser())

app.use('/login', loginRoute)
app.use('/register', signInRoute)

app.use(Authentication.authToken)

app.use('/user', userRoute)

module.exports = app;