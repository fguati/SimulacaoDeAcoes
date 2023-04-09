const { checkifValidPassword } = require('./hash.js')
const { InvalidCredentialsError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");


async function validateLogin(enteredEmail, enteredPassword) {
    try {
        const { hashed_password, salt } = await checkIfValidUser(enteredEmail)
        return checkifValidPassword(enteredPassword, hashed_password, salt)
        
    } catch (error) {
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

module.exports = { validateLogin }