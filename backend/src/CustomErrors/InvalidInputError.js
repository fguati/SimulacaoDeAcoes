const BaseError = require("./BaseError")

//Error thrown whenever data inputed by the client and sent in the http request is not valid (undefined, null, empty, or not belonging to the correct type)
class InvalidInputError extends BaseError {
    constructor(message, InvalidInputList) {
        super(message, 422, `List of invalid inputs: ${InvalidInputList}`)
        this.name = 'InvalidInputError'
    }

}

module.exports = {InvalidInputError};