const BaseError = require("./BaseError")

class UniqueConstraintError extends BaseError {
    constructor(errorColumn) {
        const message = `Column ${errorColumn} already has this entry`
        super(message, 422, `Unique Column ${errorColumn}`)
        this.name = 'UniqueConstraintError'
        this.errorColumn = errorColumn
    }

}

module.exports = {UniqueConstraintError}