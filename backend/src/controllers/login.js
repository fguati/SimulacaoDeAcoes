const { InvalidInputError, InvalidCredentialsError } = require("../CustomErrors");
const { validateLogin } = require('../services/validate.js');
const { listInvalidInputs } = require('../utils/invalidInputFunctions.js')
const JWToken = require('../services/tokens.js')
const { authTokenDurationInSec } = require("../utils/globalVariables")


function sendAuthTokenResponse(req, res) {
    let authToken = JWToken.generate(req.body)
    res.set('Authorization', authToken)
    res.setHeader('Set-Cookie', `authToken=${authToken}; Max-Age=${authTokenDurationInSec}; Path=/`)
    return res.status(200).send(JSON.stringify({authToken: authToken}))
}

function sendInvalidInputError(req, next) {
    const invalidInputList = listInvalidInputs(req.body, ['email', 'senha'])
    const error = new InvalidInputError('Invalid info submitted',invalidInputList)
    return next(error)

}

class LoginController {
    static async login(req, res, next) {
        try {
            const {email, senha} = req.body

            if(!email || !senha) {
                return sendInvalidInputError(req, next)
            }

            if(await validateLogin(email, senha)) {
                return sendAuthTokenResponse(req, res)
            }
            
            return next(new InvalidCredentialsError('Invalid Password'))

        } catch (error) {
            return next(error)
        }
    }
}

module.exports = LoginController