class MissingAuthTokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'MissingAuthTokenError'
    }
}

function treatMissingAuthTokenError(error, res) {
    if (error instanceof MissingAuthTokenError) {
        const responseObject = {
            name: error.name,
            message: error.message
        }
        return res.status(401).send(JSON.stringify(responseObject))
    }
}

module.exports = { MissingAuthTokenError, treatMissingAuthTokenError }