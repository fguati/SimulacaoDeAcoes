const { NotFoundError, InvalidInputError } = require("../../CustomErrors");
const { checkUniqueConstraintError, checkInvalidInputsErrors, checkForeignKeyError, checkNotNullSqlError } = require("../../utils");
const { dbRun, dbAll } = require("../utils/dbutils");

/**
 * Class that manages the stock position table on the database. This table has each users position
 * in each of its stocks as an entry 
 */
class PositionDAO {

    //method that insert a new stock position on the database
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
            checkUniqueConstraintError(error, 'stock_positions')
            //check if error was caused by user_id not being found in users table (Foreign key constraint)
            checkForeignKeyError(error, 'User not found on database')

            //throw error so it can be caught at controller level
            throw error
        }
    }

    //method that insert a new stock position on the database, but identify the user by its email instead of id
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
            checkUniqueConstraintError(error, 'stock_positions')

            //check if error is due to user with entered email not existing in db
            checkNotNullSqlError(error, 'Entered email was not found in database', NotFoundError)

            //throw the error so it can be caught on the controller layer
            throw error
        }
    }

    //method that searches for all positions of an user in the db through its id. Can optionally filter results by stock ticker
    static async selectByUserId(userId, stockTickerFilter = null) {
        //base sql for select by id
        const userIdSql = `SELECT * FROM stock_positions WHERE user_id=?`

        //check if stockTicker was received and add it to sql if it was
        const stockTIckerSql = stockTickerFilter ? ` AND stock_ticker=?;` : ';'
        const sql = userIdSql + stockTIckerSql 

        //throw error if userId was not entered
        if(!userId) {
            throw new InvalidInputError("selectByUserId method must receive the desired user's id as an argument", ['user_id'])
        }

        //make sql query
        const sqlParameters = stockTickerFilter ? [userId, stockTickerFilter] : [userId] 
        const result = await dbAll(sql, sqlParameters)

        //throw error if result is empty
        if(result === []) {
            throw new NotFoundError('Requested user not fount in database')
        }

        //return list of positions if query doesnt have stock ticker and just the found position if it has
        return stockTickerFilter ? result[0] : result
        
    }

}

module.exports = PositionDAO