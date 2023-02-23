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
            code: error.name,
            message: error.message,
            listOfInvalidInputs: error.InvalidInputList
        }
        return res.status(422).send(responseObject)
    }
}

module.exports = { InvalidInputError, treatInvalidInputError };