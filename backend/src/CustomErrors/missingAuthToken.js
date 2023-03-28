const BaseError = require("./BaseError")

class MissingAuthTokenError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'MissingAuthTokenError'
    }
}

module.exports = {MissingAuthTokenError}