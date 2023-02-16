const { InvalidInputError, treatInvalidInputError } = require('../CustomErrors')

const errorList = {
    InvalidInputError: treatInvalidInputError
}

function treatError(error, res) {
    const treatFunction = errorList[error.constructor.name]
    if(treatFunction) {
        return treatFunction(error, res)
    }
    return res.status(500).send(error.message)
}

module.exports = treatError;