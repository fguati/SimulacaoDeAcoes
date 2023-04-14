require("dotenv").config()
const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require("../CustomErrors");
const { authTokenDurationInSec } = require("../utils/globalVariables");

//Class responsible for handling any json web token used in the application
class JWToken {

    //method receives a payload and generate a JWT from it. It accepts keys as a second argument, but by default uses the key stored in a enviroment variable
    static generate(payload, key = process.env.JWT_KEY) {
        const token = jwt.sign(payload, key, {
            expiresIn: authTokenDurationInSec
        })
        
        return token

    }

    /** method receives a JWT, checks if its valid, throwing proper errors in case its not, and returns the payload.
    Accepts an optional key argument in case the JWT was not generated with the default key */
    static validateJWT(token, key = process.env.JWT_KEY) {
        try {
            const payload = jwt.verify(token, key)
            return payload
            
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                throw new TokenExpiredError(error.message, error.expiredAt)
            }
            if(error.name === 'JsonWebTokenError'){
                throw new JsonWebTokenError(error.name)
            }
            throw error
        }
    }
}



module.exports = JWToken