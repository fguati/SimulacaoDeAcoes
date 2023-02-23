const { InvalidInputError, treatInvalidInputError } = require('./InvalidInputError.js')
const { UniqueConstraintError, treatUniqueConstraintError } = require('./UniqueConstraintError.js')

module.exports = { 
    InvalidInputError,
    treatInvalidInputError, 
    UniqueConstraintError,
    treatUniqueConstraintError 
}