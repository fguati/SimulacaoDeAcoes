const BaseError = require("./BaseError")

//Error for malformed or invalid JWT
class JsonWebTokenError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'JsonWebTokenError'
    }
}

module.exports = {JsonWebTokenError}