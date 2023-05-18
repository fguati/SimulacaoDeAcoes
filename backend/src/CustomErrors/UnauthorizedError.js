const BaseError = require("./BaseError")

//Error thrown whenever a request needs credentials from the user but the ones provided are not valid
class UnauthorizedError extends BaseError {
    constructor(message = 'Forbidden access: user cannot access this route') {
        super(message, 403)
        this.name = 'UnauthorizedError'
    }

}

module.exports = {UnauthorizedError}