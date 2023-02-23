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
            code: error.name,
            message: error.message,
            uniqueColumn: error.errorColumn
        }
        return res.status(422).send(responseObject)
    }
}




module.exports = { UniqueConstraintError, treatUniqueConstraintError }