const { Router } = require('express')
const UserController = require('../controllers/user')
const PasswordHasher = require('../middleware/PasswordHasher')

//this router is accessed through the route /register
const router = Router()

//the password hasher middleware generate the salt and hashes the password before sending them to the user controller
router.post('/', [PasswordHasher.HashUserPassword, UserController.postUser])

module.exports = { router }