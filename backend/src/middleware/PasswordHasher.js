const { InvalidInputError } = require("../CustomErrors")
const { generateHashedPasswordAndSalt } = require("../services/hash")

class  PasswordHasher {
    static async HashUserPassword(req, res, next) {
        try {
            if(!req.body.password) {
                throw new InvalidInputError('Request has no password', ['password'])
            }

            const { password } = req.body
            const { hashed_password, salt } = generateHashedPasswordAndSalt(password)
            req.body.salt = salt
            req.body.hashed_password = hashed_password
            next()

        } catch (error) {
            next(error)

        }
    }
}

module.exports = PasswordHasher;