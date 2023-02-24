function validateLogin(dbPassword, enteredPassword) {
    return dbPassword === enteredPassword
}

module.exports = validateLogin