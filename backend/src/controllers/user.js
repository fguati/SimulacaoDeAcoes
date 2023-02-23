const { userPropertyList, listInvalidInputs } = require('../utils')

const UserDAO = require('../db/ComunicationDB/user.js');
const { InvalidInputError } = require('../CustomErrors');
const { hasInvalidParam } = require('../utils');
const treatError = require('../services/errorTreating.js');

class UserController {
    static async getAll(req, res) {
        try {
            const listOfUsers = await UserDAO.select();
            return res.status(200).send(JSON.stringify(listOfUsers))
        } catch (error) {
            return treatError(error, res)
        }
    }

    static async postUser(req, res) {
        try {
            const newUser = req.body
            const listParams = userPropertyList.map(key => newUser[key])

            if(hasInvalidParam(listParams)) {
                const invalidInputs = listInvalidInputs(newUser, userPropertyList)
                throw new InvalidInputError('Invalid user information', invalidInputs)
            }

            await UserDAO.insert(newUser)
            return res.status(201).send('User created successfully')
            
        } catch (error) {
            return treatError(error, res)
        }
    }
}

module.exports = UserController;