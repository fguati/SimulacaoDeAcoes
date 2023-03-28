const BaseError = require("./BaseError")

class InvalidInputError extends BaseError {
    constructor(message, InvalidInputList) {
        super(message, 422, `List of invalid inputs: ${InvalidInputList}`)
        this.name = 'InvalidInputError'
    }

}

module.exports = {InvalidInputError};