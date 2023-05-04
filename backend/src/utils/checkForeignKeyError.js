const { NotFoundError } = require('../CustomErrors')

/**receives an error, throw a new one in the not found class
 * if the received one that is an sqlite foreign key constraint error. Makes use
 * of the standard error message of sqlite in order to do it: 
 * "[Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed]"
*/
function checkForeignKeyError(error, customMessage = null) {
    //checks if error is an sqlite error
    const isSqliteError = error.message.includes('SQLITE_CONSTRAINT')
    if (isSqliteError) {

        //checks if the error is due to foreign key constraint
        const isForeignKeyConstraintError = error.message.includes('FOREIGN KEY')

        //uses sqlite error message by default, but overrides it if custom message is entered
        const errorMessage = customMessage ? customMessage : error.message

        //throws the not found error
        if(isForeignKeyConstraintError) {
            throw new NotFoundError(errorMessage)
        }
    }
}

module.exports = checkForeignKeyError;