const BaseError = require("./BaseError")

//Error thrown whenever a request needs credentials from the user but the ones provided are not valid
class InvalidCredentialsError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'InvalidCredentialsError'
    }

}

module.exports = {InvalidCredentialsError}