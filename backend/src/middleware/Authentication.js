const JWToken = require('../services/tokens.js')
const { MissingAuthTokenError } = require('../CustomErrors')

class Authentication {
    //authenticate requests through the use of a authToken
    static async authToken(req, res, next) {
        try {
            //retrieve the authToken from the user cookies
            const cookies = req.cookies;
            const authToken = cookies['authToken'];

            //check if an authToken was actually found on the cookies and, if not, send an error to the error handler middleware
            if(!authToken){
                throw new MissingAuthTokenError('faltou o auth')
            }

            /**validate the token. The payload is stored so, in the implementation of future 
            functionalities, it can be added to the res object and sent to the frontend to be 
            cashed or to the req object to be user in other middlewares or controllers */
            const payload = JWToken.validateJWT(authToken)
            req.body.payloadJWT = payload
            
            return next()
            
        } catch (error) {
            return next(error)
        }
        
    } 
    
}

module.exports = Authentication