require("dotenv-safe").config()
const jwt = require('jsonwebtoken');

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
        throw error
    }
}

module.exports = { generateJWT, validateJWT }