const { Router } = require('express')
const UserController = require('../controllers/user')
const { authorization } = require('../middleware/authorization')

//this router is accessed through the route /user
const router = Router()

//route to get portfolio from logged user
router.get('/portfolio', UserController.getPortfolio)
router.post('/deposit', UserController.moveFunds)

//routes available for admin role: access to user database
router.use(authorization(['ADMIN']))
router.get('/', UserController.getAll)
router.get('/:id', UserController.getOneById)

router.post('/', UserController.postUser)


module.exports = { router }
