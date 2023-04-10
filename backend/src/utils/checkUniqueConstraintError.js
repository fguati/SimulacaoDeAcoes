const { UniqueConstraintError } = require('../CustomErrors')

function checkUniqueConstraintError(error) {
    const isSqliteError = error.message.includes('SQLITE_CONSTRAINT')
    console.log(error.message)
    if (isSqliteError) {
        const isUniqueConstraintError = error.message.includes('UNIQUE')
        const regexColumn = /users.(.*)/
        const errorColumn = error.message.match(regexColumn)[1]

        if(isUniqueConstraintError) {
            throw new UniqueConstraintError(errorColumn)
        }
    }
}

module.exports = checkUniqueConstraintError;