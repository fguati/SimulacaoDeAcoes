const { Router } = require('express');
const LoginController = require('../controllers/login.js')

//this router is accessed through the route /login
const router = Router()

router.post('/', LoginController.login)

module.exports = { router }