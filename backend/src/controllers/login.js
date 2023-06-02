const { InvalidInputError, InvalidCredentialsError } = require("../CustomErrors");
const { validateLogin } = require('../services/validate.js');
const { listInvalidInputs, hasInvalidParam } = require('../utils/invalidInputFunctions.js')
const JWToken = require('../services/tokens.js')
const { authTokenDurationInSec } = require("../utils/globalVariables");
const { sendOKResponse } = require("./utils");

const inputNamesFromBody = ['email', 'password']

function sendAuthTokenResponse(user, res) {
    let authToken = JWToken.generate(user)
    res.set('Authorization', authToken)
    res.setHeader('Set-Cookie', `authToken=${authToken}; Max-Age=${authTokenDurationInSec}; SameSite=None; Secure; Path=/`)
    return sendOKResponse(res, {authToken: authToken})
}

function sendInvalidInputError(req, next) {
    const invalidInputList = listInvalidInputs(req.body, inputNamesFromBody)
    const error = new InvalidInputError('Invalid info submitted',invalidInputList)
    return next(error)

}

class LoginController {
    static async login(req, res, next) {
        try {
            const {email, password} = req.body

            if(hasInvalidParam([email, password])) {
                return sendInvalidInputError(req, next)
            }

            const userInfo = await validateLogin(email, password)

            if(userInfo) {
                return sendAuthTokenResponse(userInfo, res)
            }
            
            return next(new InvalidCredentialsError('Invalid Password'))

        } catch (error) {
            return next(error)
        }
    }
}

module.exports = LoginController