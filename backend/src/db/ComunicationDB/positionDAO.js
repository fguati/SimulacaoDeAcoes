const { checkUniqueConstraintError, checkInvalidInputsErrors, checkForeignKeyError } = require("../../utils");
const { dbRun } = require("../utils/dbutils");

class positionDAO {

    static async insert(position) {
        //sql for inserting position in db
        const sql = `INSERT INTO stock_positions (user_id, stock_ticker, stock_qty, stock_avg_price) VALUES (?, ?, ?, ?)`
        //list of mandatory columns for positions table
        const positionPropertyList = ['user_id, stock_ticker, stock_qty, stock_avg_price']
        
        try {
            //transforming position object in a list of params
            const { user_id, stock_ticker, stock_qty, stock_avg_price } = position
            const listOfArguments = [user_id, stock_ticker, stock_qty, stock_avg_price]

            //checking if any mandatory parameter has invalid values
            checkInvalidInputsErrors(listOfArguments, position, positionPropertyList)

            //run insert sql with the params from the received position
            await dbRun(sql, listOfArguments)

        } catch (error) {
            //check if error was caused by user already having the stock to be inserted
            checkUniqueConstraintError(error)
            //check if error was caused by user_id not being found in users table (Foreign key constraint)
            checkForeignKeyError(error, 'User not found on database')

            //throw error so it can be caught at controller level
            throw error
        }
    }

    static async insertByEmail(positionWEmail){
        //sql for the insert using the user email to query for the user id
        const sql = `
            INSERT INTO stock_positions (user_id, stock_ticker, stock_qty, stock_avg_price) 
            VALUES ((
                SELECT id from users WHERE email=?
            ), ?, ?, ?)
        `
        //list of mandatory arguments for the insert
        const listOfInputNames = ['email', 'stock_ticker', 'stock_qty', 'stock_avg_price']

        //get all the data from destructuring the position argument and create argument list
        const {email, stock_ticker, stock_qty, stock_avg_price} = positionWEmail
        const listOfArguments = [email, stock_ticker, stock_qty, stock_avg_price]

        try {
            //check for missing inputs error
            checkInvalidInputsErrors(listOfArguments, positionWEmail, listOfInputNames)

            //run the sql with the arguments
            await dbRun(sql, listOfArguments)

        } catch (error) {
            //check if error is due to position already existing in DB
            checkUniqueConstraintError(error)

            //check if error is due to user with entered email not existing in db
            checkForeignKeyError(error, 'Entered email was not found in database')

            //throw the error so it can be caught on the controller layer
            throw error
        }
    }
}

module.exports = positionDAO