const { InvalidInputError } = require("../../CustomErrors");
const { checkUniqueConstraintError, checkInvalidInputsErrors } = require("../../utils");
const checkForeignKeyError = require("../../utils/checkForeignKeyError");
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
}

module.exports = positionDAO