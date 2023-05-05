const { NotFoundError, InvalidInputError } = require("../../CustomErrors");
const { checkUniqueConstraintError, checkInvalidInputsErrors, checkForeignKeyError, checkNotNullSqlError } = require("../../utils");
const { dbRun, dbAll, dbGet } = require("../utils/dbutils");

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

        //return list of positions if query doesnt have stock ticker and just the found position if it has
        return stockTickerFilter ? result[0] : result
        
    }

    //method that searches for all positions of an user in the db through its email. Can optionally filter results by stock ticker
    static async selectByUserEmail(userEmail, stockTickerFilter = null) {
        //base sql for select positions by user email. Uses right join so we get a result if an user exists but have no stocks 
        const userByEmailsql = `
            SELECT stock_positions.*, users.email 
            FROM stock_positions
            RIGHT JOIN users ON stock_positions.user_id = users.id 
            WHERE users.email = ?
        `

        //optional sql for filtering by stock ticker
        const optionalFilterByStockSql = stockTickerFilter ? ' AND stock_positions.stock_ticker = ?' : ';'

        //combine full sql
        const sqlQuery = userByEmailsql + optionalFilterByStockSql

        //check if email was entered
        if(!userEmail) {
            throw new InvalidInputError('User email must be entered for this method to be called', ['email'])
        }
        
        //run sql query
        const sqlParameters = stockTickerFilter ? [userEmail, stockTickerFilter] : [userEmail]
        let queryResult = await dbAll(sqlQuery, sqlParameters)
        
        //if email was found in the db a list with at least one result for the user email will be returned. Therefore if the list returned by the query is empty, the user email was not found, or was found but doesnt have the filtered stock
        if(queryResult.length === 0) {
            throw new NotFoundError('Could not find the searched data in our database')
        }

        //check if user has any stocks and if not, return an empty list. As is currently, an user without stocks return a list with 1 entry that has stock position id null
        if(queryResult[0].id === null) {
            return []
        }

        //return list of positions if query doesnt have stock ticker and just the found position if it has
        return stockTickerFilter ? queryResult[0] : queryResult
            
    }

    //method that deletes a position by its id
    static async deleteByPositionId(id) {
        //check if id was entered
        if(!id) {
            throw new InvalidInputError('Please enter the id of the position to be deleted', ['id'])
        }
        //delete sql with deleted entry id as return value
        const sql = `DELETE FROM stock_positions WHERE id=? RETURNING id`

        //run sql, geting its return value to check if deletion was successful
        const deletedItem = await dbGet(sql, [id])

        //check if return value has the same id as entered id to see if deletion was successful
        if(deletedItem.id != id){
            throw new NotFoundError('Couldnt find the entered id to delete')
        }
    }

}

module.exports = PositionDAO