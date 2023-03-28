const BaseError = require("./BaseError")

class JsonWebTokenError extends BaseError {
    constructor(message) {
        super(message, 401)
        this.name = 'JsonWebTokenError'
    }
}

module.exports = {JsonWebTokenError}