const express = require('express');

const {router: userRoute} = require('./routes/user.js');
const {router: signInRoute} = require('./routes/register.js')
const {router: loginRoute} = require('./routes/login.js')

const app = express();

app.use(express.json())

app.use('/user', userRoute)
app.use('/register', signInRoute)
app.use('/login', loginRoute)

module.exports = app;