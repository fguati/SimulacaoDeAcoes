const BaseError = require("./BaseError")

//Error thrown when a required JWT is expired
class TokenExpiredError extends BaseError {
    constructor(message, expiredAt) {
        super(message, 401, `Expired at: ${expiredAt}`)
        this.name = 'TokenExpiredError'
        this.expiredAt = expiredAt
    }
}

module.exports = {TokenExpiredError}