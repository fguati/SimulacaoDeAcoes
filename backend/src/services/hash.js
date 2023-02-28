const crypto = require('crypto')

function generateSalt() {
    return crypto.randomBytes(256).toString('hex')
}

function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha512', salt)
    const passwordHash = hash.update(password).digest('hex')
    return passwordHash
}

function generateHashedPasswordAndSalt(password) {
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt)
    return { hashedPassword, salt }
}

function checkifValidPassword(enteredPassword, dbHashedPassword, dbSalt) {
    const hashedEnteredPassword = hashPassword(enteredPassword, dbSalt)
    return hashedEnteredPassword === dbHashedPassword
}

module.exports = { generateHashedPasswordAndSalt, checkifValidPassword }