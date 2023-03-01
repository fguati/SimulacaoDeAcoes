require("dotenv-safe").config()
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require("../CustomErrors");

function generateJWT(payload) {
    const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn:'5m'
    })

    return token
}

function validateJWT(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY)
        return payload
        
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            throw new TokenExpiredError(error.message, error.expiredAt)
        }
        throw error
    }
}

module.exports = { generateJWT, validateJWT }