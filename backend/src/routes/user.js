const { Router } = require('express')
const UserController = require('../controllers/user')

//this router is accessed through the route /user
const router = Router()

//route to get portfolio from logged user
router.get('/portfolio', UserController.getPortfolio)

//apply middleware authorization?
router.get('/', UserController.getAll)
router.get('/:id', UserController.getOneById)

router.post('/', UserController.postUser)
router.post('/deposit', UserController.moveFunds)

module.exports = { router }
