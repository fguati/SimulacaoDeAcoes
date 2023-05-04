const { InvalidInputError } = require('../CustomErrors')

/**receives an error, throw a new one in the requested class (invalid input by default)
 * if the received one that is an sqlite not null constraint error. Makes use
 * of the standard error message of sqlite in order to do it: 
 * "SQLITE_CONSTRAINT: NOT NULL constraint failed: stock_positions.user_id"
*/
function checkNotNullSqlError(error, customMessage = null, ErrorType = InvalidInputError) {
    //checks if error is an sqlite error
    const isSqliteError = error.message.includes('SQLITE_CONSTRAINT')
    if (isSqliteError) {

        //checks if the error is due to foreign key constraint
        const isForeignKeyConstraintError = error.message.includes('NOT NULL')

        //uses sqlite error message by default, but overrides it if custom message is entered
        const errorMessage = customMessage ? customMessage : error.message

        //throws the not found error
        if(isForeignKeyConstraintError) {
            throw new ErrorType(errorMessage)
        }
    }
}

module.exports = checkNotNullSqlError;