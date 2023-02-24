const express = require('express');

const {router: userRoute} = require('./routes/user.js');
const {router: signInRoute} = require('./routes/signIn.js')

const app = express();

app.use(express.json())

app.use('/user', userRoute)
app.use('/signin', signInRoute)

module.exports = app;