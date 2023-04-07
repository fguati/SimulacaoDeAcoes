const { InvalidInputError } = require("../CustomErrors")
const { generateHashedPasswordAndSalt } = require("../services/hash")

class  PasswordHasher {
    static async HashUserPassword(req, res, next) {
        try {
            if(!req.body.senha) {
                throw new InvalidInputError('Request has no password', ['senha'])
            }

            const { senha } = req.body
            const { hashedPassword, salt } = generateHashedPasswordAndSalt(senha)
            req.body.salt = salt
            req.body.hashedPassword = hashedPassword
            next()

        } catch (error) {
            next(error)

        }
    }
}

module.exports = PasswordHasher;