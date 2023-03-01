require("dotenv-safe").config()
const jwt = require('jsonwebtoken');

function generateJWT(payload) {
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn:'5m'
    })

    return token
}

module.exports = { generateJWT }