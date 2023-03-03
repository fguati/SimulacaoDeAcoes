const { InvalidInputError, treatInvalidInputError } = require('./InvalidInputError.js')
const { UniqueConstraintError, treatUniqueConstraintError } = require('./UniqueConstraintError.js')
const { InvalidCredentialsError, treatInvalidCredentialsError } = require('./InvalidCredentialsError.js')
const { TokenExpiredError, treatTokenExpiredError } = require('./TokenExpiredError.js')
const { JsonWebTokenError, treatJsonWebToken } = require('./JsonWebTokenError.js')
const { MissingAuthTokenError, treatMissingAuthTokenError } = require('./missingAuthToken.js')

module.exports = { 
    InvalidInputError,
    treatInvalidInputError, 
    UniqueConstraintError,
    treatUniqueConstraintError,
    InvalidCredentialsError, 
    treatInvalidCredentialsError,
    TokenExpiredError, 
    treatTokenExpiredError,
    JsonWebTokenError, 
    treatJsonWebToken ,
    MissingAuthTokenError, 
    treatMissingAuthTokenError
}