const { checkifValidPassword } = require('./hash.js')
const { validateJWT } = require('./tokens.js')
const { InvalidCredentialsError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");


async function validateLogin(enteredEmail, enteredPassword) {
    try {
        const { senhaHash, salt } = await checkIfValidUser(enteredEmail)
        return checkifValidPassword(enteredPassword, senhaHash, salt)
        
    } catch (error) {
        console.log('Login validation error:', error)
        throw error
    }
}

async function checkIfValidUser(email) {
    const dbUserInfo = await UserDAO.selectByEmail(email)

        if(!dbUserInfo) {
            throw new InvalidCredentialsError('Invalid email')
        }
    return dbUserInfo
}

module.exports = { validateLogin, validateJWT }