const treatError = require('#root/src/services/errorTreating.js');
const JWToken = require('../services/tokens.js')
const { MissingAuthTokenError } = require('../CustomErrors')

class Authentication {

    static async authToken(req, res, next) {
        
        try {
            const cookies = req.cookies;
            const authToken = cookies['authToken'];

            if(!authToken){
                throw new MissingAuthTokenError('faltou o auth')
            }

            const payload = JWToken.validateJWT(authToken)
            
            return next()
            
            
        } catch (error) {
            return treatError(error, res)
        }
        
    } 

}

module.exports = Authentication