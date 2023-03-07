class JsonWebTokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'JsonWebTokenError'
    }
}

function treatJsonWebToken(error, res) {
    if(error instanceof JsonWebTokenError){
        const responseObject = {
            code: error.name,
            message: error.message
        }

        return res.status(401).send(JSON.stringify(responseObject))
    }
}

module.exports = { JsonWebTokenError, treatJsonWebToken }