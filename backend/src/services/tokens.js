require("dotenv-safe").config()
const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require("../CustomErrors");

class JWToken {

    static generate(payload, key = process.env.JWT_KEY) {
        const token = jwt.sign(payload, key, {
            expiresIn:'5m'
        })
        
        return token

    }
    
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