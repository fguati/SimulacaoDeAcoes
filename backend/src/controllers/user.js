const { listInvalidInputs } = require('../utils')

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

    static async getOneById(req, res) {
        const id = req.params.id
        try {
            const user = await UserDAO.selectById(id)
            
            if(!user) {
                throw new InvalidInputError("Id not found", [id])
            }

            return res.status(200).json(user)

        } catch (error) {
            return treatError(error, res)
        }
    }

    static async postUser(req, res) {
        const userPropertyList = ['nome', 'email', 'senha']
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