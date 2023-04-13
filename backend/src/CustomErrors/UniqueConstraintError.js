const BaseError = require("./BaseError")

//Error thrown whenever there is an atempt to insert repeated data in a column with the Unique Constraint in the db 
class UniqueConstraintError extends BaseError {
    constructor(errorColumn) {
        const message = `Column ${errorColumn} already has this entry`
        super(message, 422, `Unique Column ${errorColumn}`)
        this.name = 'UniqueConstraintError'
        this.errorColumn = errorColumn
    }

}

module.exports = {UniqueConstraintError}