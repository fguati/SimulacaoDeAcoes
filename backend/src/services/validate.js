const { checkifValidPassword } = require('./hash.js')
const { InvalidCredentialsError } = require("../CustomErrors");
const UserDAO = require("../db/ComunicationDB/user");

//Receives the email and password of an user, uses it to retrieve its info from the DB and uses the hash module in order to check if the entered info is valid
async function validateLogin(enteredEmail, enteredPassword) {
    const { id, username, hashed_password, salt } = await checkIfValidUser(enteredEmail)
    if(checkifValidPassword(enteredPassword, hashed_password, salt)) {
        return {id, username} 
    }

    return false

}

/**uses the entered email to look for an user in the DB, returning an invalid credentials error in case of
 not finding one */
async function checkIfValidUser(email) {
    const dbUserInfo = await UserDAO.selectByEmail(email)

        if(!dbUserInfo) {
            throw new InvalidCredentialsError('Invalid email')
        }
    return dbUserInfo
}

module.exports = { validateLogin }