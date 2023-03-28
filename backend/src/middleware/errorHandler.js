const BaseError = require('../CustomErrors/BaseError')

function errorHandler(error, req, res, next) {
    
    if(error instanceof BaseError) {
        return error.sendErrorResponse(res)
    }

    return res.status(500).send(JSON.stringify({code: error.name, message: error.message}))
}

module.exports = { errorHandler }