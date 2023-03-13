class UniqueConstraintError extends Error {
    constructor(errorColumn) {
        const message = `Column ${errorColumn} already has this entry`
        super(message)
        this.name = 'UniqueConstraintError'
        this.errorColumn = errorColumn
    }

}

function treatUniqueConstraintError (error, res) {
    if (error instanceof UniqueConstraintError) {
        const responseObject ={
            name: error.name,
            message: `The ${error.errorColumn} entered is already registered in our database. Please attempt with another ${error.errorColumn}`,
            aditionalInfo: `uniqueColumn: ${error.errorColumn}`
        }
        return res.status(422).send(JSON.stringify(responseObject))
    }
}




module.exports = { UniqueConstraintError, treatUniqueConstraintError }