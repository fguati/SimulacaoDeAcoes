class TokenExpiredError extends Error {
    constructor(message, expiredAt) {
        super(message)
        this.name = 'TokenExpiredError'
        this.expiredAt = expiredAt
    }
}

function treatTokenExpiredError(error, res) {
    if(error instanceof TokenExpiredError) {
        const responseObject = {
            name: error.name,
            message: error.message,
            aditionalInfo: `expiredAt: ${error.expiredAt}`
        }

        return res.status(401).send(JSON.stringify(responseObject))
    }
}

module.exports = { TokenExpiredError, treatTokenExpiredError }