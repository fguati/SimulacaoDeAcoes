const BaseError = require("./BaseError")

//Error thrown when a request needs authenticantion or authorization to be processed but has no authToken
class MissingAuthTokenError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'MissingAuthTokenError'
    }
}

module.exports = {MissingAuthTokenError}