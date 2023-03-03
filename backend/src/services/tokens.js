require("dotenv-safe").config()
const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require("../CustomErrors");

class JWToken {
    constructor(payload){
        this.token = JWToken.generate(payload)
    }

    static generate(payload) {
        const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn:'5m'
        })
        
        return token

    }
    
    static validateJWT(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY)
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