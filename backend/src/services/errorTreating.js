const BaseError = require('../CustomErrors/BaseError')

function treatError(error, res) {
    
    if(error instanceof BaseError) {
        return error.sendErrorResponse(res)
    }

    return res.status(500).send(JSON.stringify({code: error.name, message: error.message}))
}

module.exports = treatError;