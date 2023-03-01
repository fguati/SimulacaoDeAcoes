const { checkifValidPassword } = require('./hash.js')

function validateLogin(enteredPassword, dbHashedPassword, dbSalt) {
    return checkifValidPassword(enteredPassword, dbHashedPassword, dbSalt)
}

module.exports = validateLogin