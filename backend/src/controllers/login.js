const { InvalidInputError, InvalidCredentialsError } = require("../CustomErrors");
const treatError = require("../services/errorTreating");
const { validateLogin } = require('../services/validate.js');
const { listInvalidInputs } = require('../utils/invalidInputFunctions.js')
const JWToken = require('../services/tokens.js')
const { authTokenDurationInSec } = require("../utils/globalVariables")


function sendAuthTokenResponse(req, res) {
    let authToken = JWToken.generate(req.body)
    res.set('Authorization', authToken)
    res.setHeader('Set-Cookie', `authToken=${authToken}; Max-Age=${authTokenDurationInSec}; Path=/`)
    return res.status(200).send(authToken)
}

function throwInvalidInputError(req) {
    const invalidInputList = listInvalidInputs(req.body, ['email', 'senha'])
    throw new InvalidInputError('Invalid info submitted',invalidInputList)

}

class LoginController {
    static async login(req, res) {
        try {
            const {email, senha} = req.body

            if(!email || !senha) {
                throwInvalidInputError(req)
            }

            if(await validateLogin(email, senha)) {
                return sendAuthTokenResponse(req, res)
            }
            
            throw new InvalidCredentialsError('Invalid Password')

        } catch (error) {
            treatError(error, res)
        }
    }
}

module.exports = LoginController