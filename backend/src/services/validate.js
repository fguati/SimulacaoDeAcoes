const { checkifValidPassword } = require('./hash.js')
const { InvalidCredentialsError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");


async function validateLogin(enteredEmail, enteredPassword) {
    try {
        const { id, username, hashed_password, salt } = await checkIfValidUser(enteredEmail)
        if(checkifValidPassword(enteredPassword, hashed_password, salt)) {
            return {id, username} 
        }

        return false
        
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