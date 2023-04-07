const { Router } = require('express')
const UserController = require('../controllers/user')
const PasswordHasher = require('../middleware/PasswordHasher')

const router = Router()

router.post('/', [PasswordHasher.HashUserPassword, UserController.postUser])

module.exports = { router }