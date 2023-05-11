const { listInvalidInputs } = require('../utils')

const UserDAO = require('../db/ComunicationDB/user.js');
const { InvalidInputError } = require('../CustomErrors');
const { hasInvalidParam } = require('../utils');

class UserController {
    static async getAll(req, res, next) {
        try {
            const listOfUsers = await UserDAO.select();
            return res.status(200).send(JSON.stringify(listOfUsers))
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

            return res.status(200).send(JSON.stringify(user))

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
            return res.status(201).send(JSON.stringify({message: 'User created successfully'}))
            
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
            return res.status(200).send(JSON.stringify({ balance }))
            
        } catch (error) {
            //send error to error treating middleware
            return next(error)
        }
    }

}

module.exports = UserController;