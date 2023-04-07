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
        const listOfUserPropertyNames = ['nome', 'email', 'salt', 'hashedPassword']
        try {
            const newUser = req.body
            const listParams = listOfUserPropertyNames.map(key => newUser[key])

            if(hasInvalidParam(listParams)) {
                const invalidInputs = listInvalidInputs(newUser, listOfUserPropertyNames)
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