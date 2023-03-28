const BaseError = require("./BaseError")

class InvalidCredentialsError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'InvalidCredentialsError'
    }

}

module.exports = {InvalidCredentialsError}