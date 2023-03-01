const { InvalidInputError, InvalidCredentialsError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");
const treatError = require("../services/errorTreating");
const validateLogin = require('../services/validateLogin.js');
const { listInvalidInputs } = require('../utils/invalidInputFunctions.js')
const { generateJWT } = require('../services/tokens.js')

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
                throw new InvalidCredentialsError('Invalid email')
            }

            if(validateLogin(senha, dbUserInfo.senhaHash, dbUserInfo.salt)) {
                let authToken = generateJWT(req.body)
                return res.status(200).send(authToken)
            }
            
            throw new InvalidCredentialsError('Invalid Password')

        } catch (error) {
            treatError(error, res)
        }
    }
}

module.exports = LoginController