class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InvalidCredentialsError'
    }
}

function treatInvalidCredentialsError(error, res) {
    if (error instanceof InvalidCredentialsError) {
        const responseObject = {
            name: error.name,
            message: error.message
        }
        return res.status(401).send(JSON.stringify(responseObject))
    }
}

module.exports = { InvalidCredentialsError, treatInvalidCredentialsError }