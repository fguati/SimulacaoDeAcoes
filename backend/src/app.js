const {router: userRoute} = require('./routes/user.js');
const express = require('express');

const app = express();
app.use(express.json())
app.use(userRoute)

module.exports = app;