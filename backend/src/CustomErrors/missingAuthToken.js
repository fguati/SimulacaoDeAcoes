class MissingAuthTokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'MissingAuthTokenError'
    }
}

function treatMissingAuthTokenError(error, res) {
    if (error instanceof MissingAuthTokenError) {
        const responseObject = {
            code: error.name,
            message: error.message
        }
        return res.status(401).send(responseObject)
    }
}

module.exports = { MissingAuthTokenError, treatMissingAuthTokenError }