const { UniqueConstraintError } = require('../CustomErrors')

/**receives an error, throw a new one in the unique constraint class
 * if the received one is an sqlite unique constraint error. Makes use
 * of the standard error message of sqlite in order to do it: 
 * "Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: <table_name>.<column_name>"
*/
function checkUniqueConstraintError(error, tableName) {
    //checks if error is an sqlite error
    const isSqliteError = error.message.includes('SQLITE_CONSTRAINT')
    if (isSqliteError) {

        //checks if the error is due to unique constraints
        const isUniqueConstraintError = error.message.includes('UNIQUE')
        
        //throws the unique constraint error
        if(isUniqueConstraintError) {
            //finds which columns violated the unique constraint to generate the error
            const regexColumn = new RegExp(`${tableName}.(.*)`)
            const errorColumn = error.message.match(regexColumn)[1]
            throw new UniqueConstraintError(errorColumn)
        }
    }
}

module.exports = checkUniqueConstraintError;