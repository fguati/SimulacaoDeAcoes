const { 
    treatInvalidInputError, 
    treatUniqueConstraintError,
    treatInvalidCredentialsError,
    treatTokenExpiredError,
    treatJsonWebToken,
    treatMissingAuthTokenError
} = require('../CustomErrors')

const errorList = {
    InvalidInputError: treatInvalidInputError,
    UniqueConstraintError: treatUniqueConstraintError,
    InvalidCredentialsError: treatInvalidCredentialsError,
    TokenExpiredError: treatTokenExpiredError,
    JsonWebTokenError: treatJsonWebToken,
    MissingAuthTokenError:treatMissingAuthTokenError
}

function treatError(error, res) {
    const treatFunction = errorList[error.constructor.name]
    if(treatFunction) {
        return treatFunction(error, res)
    }
    return res.status(500).send(JSON.stringify({code: error.name, message: error.message}))
}

module.exports = treatError;