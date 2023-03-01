const { InvalidInputError, treatInvalidInputError } = require('./InvalidInputError.js')
const { UniqueConstraintError, treatUniqueConstraintError } = require('./UniqueConstraintError.js')
const { InvalidCredentialsError, treatInvalidCredentialsError } = require('./InvalidCredentialsError.js')
const { TokenExpiredError, treatTokenExpiredError } = require('./TokenExpiredError')
const { JsonWebTokenError, treatJsonWebToken } = require('./JsonWebTokenError')

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
    treatJsonWebToken 
}