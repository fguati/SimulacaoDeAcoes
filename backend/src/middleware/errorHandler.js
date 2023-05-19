const BaseError = require('../CustomErrors/BaseError')

//middleware that handles any error thrown by the app
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
    //if the error is an instanceof our BaseError, it uses the BaseError method the sends the proper error response to the frontend
    if(error instanceof BaseError) {
        return error.sendErrorResponse(res)
    }

    //any error that is not an instance of BaseError is an unforeseen one, so the error response is one of internal server error
    return res.status(500).send(JSON.stringify({name: error.name, message: error.message}))
}

module.exports = { errorHandler }