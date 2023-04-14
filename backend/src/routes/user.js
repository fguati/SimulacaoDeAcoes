const { Router } = require('express')
const UserController = require('../controllers/user')

//this router is accessed through the route /user
const router = Router()

router.get('/', UserController.getAll)
router.get('/:id', UserController.getOneById)

router.post('/', UserController.postUser)

module.exports = { router }
