class InvalidInputError extends Error {
    constructor(message, InvalidInputList) {
        super(message)
        this.InvalidInputList = InvalidInputList
        this.name = 'InvalidInputError'
    }

}

function treatInvalidInputError(error, res) {
    if (error instanceof InvalidInputError) {
        const responseObject ={
            name: error.name,
            message: error.message,
            aditionalInfo: `listOfInvalidInputs: ${error.InvalidInputList}`
        }
        return res.status(422).send(JSON.stringify(responseObject))
    }
}

module.exports = { InvalidInputError, treatInvalidInputError };