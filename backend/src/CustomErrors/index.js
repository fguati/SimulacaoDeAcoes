const { InvalidInputError, treatInvalidInputError } = require('./InvalidInputError.js')
const { UniqueConstraintError, treatUniqueConstraintError } = require('./UniqueConstraintError.js')
const { InvalidCredentialsError, treatInvalidCredentialsError } = require('./InvalidCredentialsError.js')

module.exports = { 
    InvalidInputError,
    treatInvalidInputError, 
    UniqueConstraintError,
    treatUniqueConstraintError,
    InvalidCredentialsError, 
    treatInvalidCredentialsError
}