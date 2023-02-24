const { InvalidInputError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");
const treatError = require("../services/errorTreating");
const validateLogin = require('../utils/validateLogin.js');
const { listInvalidInputs } = require('../utils/invalidInputFunctions.js')

class LoginController {
    static async login(req, res) {
        try {
            const {email, senha} = req.body

            if(!email || !senha) {
                const invalidInputList = listInvalidInputs(req.body, ['email', 'senha'])
                throw new InvalidInputError('Invalid info submitted',invalidInputList)
            }

            const dbUserInfo = await UserDAO.selectByEmail(email)

            if(!dbUserInfo) {
                throw new InvalidInputError('Invalid email', ['email'])
            }

            if(validateLogin(dbUserInfo.senhaHash, senha)) {
                return res.status(200).send('Successfully logged in')
            }            

        } catch (error) {
            treatError(error, res)
        }
    }
}

module.exports = LoginController