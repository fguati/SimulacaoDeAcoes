const crypto = require('crypto')

//Function that generates salt randomly
function generateSalt() {
    return crypto.randomBytes(128).toString('hex')
}

//this function uses the the provided salt to hash the entered password
function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha512', salt)
    const passwordHash = hash.update(password).digest('hex')
    return passwordHash
}

//function the receives a password and automaticaly generate a salt and a hashed password that can then be stored in the db
function generateHashedPasswordAndSalt(password) {
    const salt = generateSalt();
    const hashed_password = hashPassword(password, salt)
    return { hashed_password, salt }
}

//compares an unhashed password with a hashed one using a salt entered as a third argument
function checkifValidPassword(enteredPassword, dbHashedPassword, dbSalt) {
    const hashedEnteredPassword = hashPassword(enteredPassword, dbSalt)
    return hashedEnteredPassword === dbHashedPassword
}

module.exports = { generateHashedPasswordAndSalt, checkifValidPassword }