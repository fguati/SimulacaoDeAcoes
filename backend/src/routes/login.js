const { Router } = require('express');
const LoginController = require('../controllers/login.js')

const router = Router()

router.post('/', LoginController.login)

module.exports = { router }