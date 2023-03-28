const JWToken = require('../services/tokens.js')
const { MissingAuthTokenError } = require('../CustomErrors')

class Authentication {

    static async authToken(req, res, next) {
        
        try {
            const cookies = req.cookies;
            const authToken = cookies['authToken'];

            if(!authToken){
                const error = new MissingAuthTokenError('faltou o auth')
                return next(error)
            }

            const payload = JWToken.validateJWT(authToken)
            
            return next()
            
            
        } catch (error) {
            return next(error)
        }
        
    } 

}

module.exports = Authentication