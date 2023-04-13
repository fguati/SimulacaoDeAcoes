const { InvalidInputError } = require("../CustomErrors")
const { generateHashedPasswordAndSalt } = require("../services/hash")

class  PasswordHasher {
    //middleware used in the register route to hash the user password
    static async HashUserPassword(req, res, next) {
        try {
            //checks if a password was sent
            if(!req.body.password) {
                throw new InvalidInputError('Request has no password', ['password'])
            }
            const { password } = req.body

            //generate the salt and the hashed password for the received password
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