const { Router } = require('express')
const UserController = require('../controllers/user')

const router = Router()

router.post('/', UserController.postUser)

module.exports = { router }