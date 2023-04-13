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

}

module.exports = UserController;