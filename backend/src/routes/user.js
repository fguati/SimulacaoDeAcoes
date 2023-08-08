const { Router } = require('express')
const UserController = require('../controllers/user')
const { authorization } = require('../middleware/authorization')

//this router is accessed through the route /user
const router = Router()

//routes to get assets from logged user
router.get('/portfolio', UserController.getPortfolio)
router.get('/balance', UserController.getBalance)

//routes to move assets from logged user
router.post('/deposit', UserController.moveFunds)
router.post('/trade', UserController.trade)

//route to get user trade history
router.get('/history', UserController.getTradeHistory)

//routes available for admin role: access to user database
router.use(authorization(['ADMIN']))
router.get('/', UserController.getAll)
router.get('/:id', UserController.getOneById)

router.post('/', UserController.postUser)


module.exports = { router }
