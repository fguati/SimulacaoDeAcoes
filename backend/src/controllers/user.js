const { listInvalidInputs } = require('../utils')

const UserDAO = require('../db/ComunicationDB/user.js');
const { InvalidInputError } = require('../CustomErrors');
const { hasInvalidParam } = require('../utils');
const UserModel = require('../Models/UserModel');
const { sendOKResponse } = require('./utils');

class UserController {
    static async getAll(req, res, next) {
        try {
            const listOfUsers = await UserDAO.select();
            return sendOKResponse(res, listOfUsers)
        } catch (error) {
            return next(error)
        }
    }

    static async getOneById(req, res, next) {
        const id = req.params.id
        try {
            const user = await UserDAO.selectById(id)
            
            if(!user) {
                return next(new InvalidInputError("Id not found", [id]))
            }

            return sendOKResponse(res, user)

        } catch (error) {
            return next(error)
        }
    }

    static async postUser(req, res, next) {
        const userPropertyNames = ['username', 'email', 'salt', 'hashed_password']
        try {
            const newUser = req.body
            const userPropsReceived = userPropertyNames.map(key => newUser[key])

            if(hasInvalidParam(userPropsReceived)) {
                const invalidInputs = listInvalidInputs(newUser, userPropertyNames)
                const invalidInputError = new InvalidInputError('Invalid user information', invalidInputs)
                return next(invalidInputError)
            }

            await UserDAO.insert(newUser)
            return sendOKResponse(res, {message: 'User created successfully'}, 201)
            
        } catch (error) {
            return next(error)
        }
    }

    //method that deposits or withdraws funds from user balance
    static async moveFunds(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if(!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //get funds moved from request body
            const { funds } = req.body

            //check if request body has the value of funds to be deposited or withdrawn
            if(isNaN(funds)) throw new InvalidInputError('Valid funds to be moved were not sent in http request', ['funds'])

            //send operation to database
            const balance = await UserDAO.updateBalance(id, funds)
            //send success response
            return sendOKResponse(res, { balance })
            
        } catch (error) {
            //send error to error treating middleware
            return next(error)
        }
    }

    //method that returns the user full portfolio
    static async getPortfolio(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if(!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //instance user model
            const user = await UserModel.instanceFromDB(id)

            //send success response with portfolio provided by user model
            return sendOKResponse(res, user.portfolio)
            
        } catch (error) {
            //send error to error treating middleware
            return next(error)    
        }
    }

    //method that returns the user balance
    static async getBalance(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if(!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //instance user model
            const user = await UserModel.instanceFromDB(id)

            //send success response with balance provided by user model
            return sendOKResponse(res, {balance: user.balance})
            
        } catch (error) {
            //send error to error treating middleware
            return next(error)    
        }
    }

    //method that trades stocks
    static async trade(req, res, next) {
        try {
            //get info from req
            const { id } = req.body.payloadJWT
            const {stockToTrade, qtyToTrade, tradeType} = req.body
    
            //instantiate the User class with id from JWT payload caried in the body
            const user = await UserModel.instanceFromDB(id)
    
            //call trade method from user class
            const updatedInfo = await user.trade(stockToTrade, Number(qtyToTrade), tradeType)
    
            //return new balance and stock position with response
            const tradeData = {
                userBalance: updatedInfo.userBalance,
                newPosition: {
                    stock: stockToTrade,
                    qty: updatedInfo.stockQty,
                    averagePrice: updatedInfo.stockAveragePrice
                }
            }
    
            return sendOKResponse(res, tradeData)
            
        } catch (error) {
            //send caught error to be processed in the error handler middleware
            return next(error)
        }
    }

}

module.exports = UserController;