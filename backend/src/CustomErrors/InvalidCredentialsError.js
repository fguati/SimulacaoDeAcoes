class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InvalidCredentialsError'
    }
}

function treatInvalidCredentialsError(error, res) {
    if (error instanceof InvalidCredentialsError) {
        const responseObject = {
            code: error.name,
            message: error.message
        }
        return res.status(401).send(responseObject)
    }
}

module.exports = { InvalidCredentialsError, treatInvalidCredentialsError }