const { InvalidInputError, NotFoundError } = require("../../../CustomErrors")
const { checkInvalidInputsErrors, checkForeignKeyError } = require("../../../utils")
const { dbGet, dbAll } = require("../../utils/dbutils")
const { validateFilters, createSqlFilterForSelect, createSqlAndArgsForUpdate } = require("./utils")

/**
 * Class responsible for comunication with DB to manipulate the negotiations table, that stores
 * data related with each stock negotiation made by users
 */
class NegotiationDAO {
    
    //method for inserting a new entry in negotiation table by directly providing all data
    static async insert(negotiationToBeInserted) {
        //List of accepeted negotiation types
        const accepetedNegotiationTypes = ['BUY', 'SELL']
        
        //insert sql
        const sql = `
            INSERT INTO negotiations (user_id, stock_ticker, negotiated_qty, negotiated_price, negotiation_type)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id;
        `

        //create argument list from entered negotiation
        const {userId, stockTicker, negotiatedQty, negotiatedPrice, negotiationType} = negotiationToBeInserted
        const listOfArguments = [userId, stockTicker, negotiatedQty, negotiatedPrice, negotiationType]
        const listOfMandatoryInputNames = ['userId', 'stockTicker', 'negotiatedQty', 'negotiatedPrice', 'negotiationType']

        //check for invalid input arguments
        checkInvalidInputsErrors(listOfArguments, negotiationToBeInserted, listOfMandatoryInputNames)

        //check arguments comply with type specifications: quantity is an integer, price a number and type is one of the defined types of negotiation
        if(!Number.isInteger(negotiatedQty)) {
            throw new InvalidInputError('Quantity of stocks negotiade must be an integer', ['negotiatedQty'])
        }
        if(isNaN(negotiatedPrice)) {
            throw new InvalidInputError('Negotiation price must be a number', ['negotiatedPrice'])
        }
        const negotiationTypeIsValid = accepetedNegotiationTypes.some(type => type === negotiationType)
        if(!negotiationTypeIsValid) {
            throw new InvalidInputError('Entered negotiation type is not supported', ['negotiationType'])
        }

        try {
            //run sql
            const negotiationId = await dbGet(sql, listOfArguments)
            return negotiationId

        } catch (error) {
            //check if error is due to user not existing in DB (Foreign Key constraint)
            checkForeignKeyError(error, 'User not found', NotFoundError)

            //throw error to be caught at controller layer
            throw error
        }
    } 

    //method for getting multiple entries from the negotiation table, with optional filters and pagination parameters
    static async select(filters = null, limitOfResults = 100, offsetBy = 0) {        
        //base sql elements
        let baseSQL = `SELECT * FROM negotiations `
        const paginationSQL = `ORDER BY negotiation_date LIMIT ${limitOfResults} OFFSET ${offsetBy}`
        
        // //Prepare to create filter setup
        let valuesToFilterList
        let filterSQL = ''

        //Handle filters if entered
        if(filters) {
            //validate filters entered
            await validateFilters(filters)

            //get filter sql and list of arguments
            const filterSqlAndArgs = createSqlFilterForSelect(filters)
            filterSQL = filterSqlAndArgs.filterSQL 
            valuesToFilterList = filterSqlAndArgs.valuesToFilterList   
        }
        
        // build final sql
        const sql = baseSQL + filterSQL + paginationSQL +  ';'

        //run sql
        const result = await dbAll(sql, valuesToFilterList)

        //return result from query
        return result
    }

    //methdo for selecting an specific negotiation by its id
    static async selectById(id) {
        //sql
        const sql = `SELECT * FROM negotiations WHERE id=?`

        //run sql
        const result = await dbGet(sql, [id])

        //throw not found error if id is not in database
        if(!result) throw new NotFoundError('Negotion not found')

        return result
    }

    //method for updating an specific negotiation
    static async update(negotiationToBeUpdated) {
        //check if argument has a negotiation id
        const { id } = negotiationToBeUpdated
        if(!id) throw new InvalidInputError('The update method requires the id of the negotiotion to be updated', ['negotiationToBeUpdated.id'])
        
        //Transform entered object in array for manipulation
        const negotiationEntries = Object.entries(negotiationToBeUpdated)

        //Removing negotiation id so items in entries array are all columns to be updated
        const idIndex = negotiationEntries.findIndex(entry => entry[0] === 'id')
        negotiationEntries.splice(idIndex, 1)

        //check if it has at least one column besides id by checking if there are any entries left after the removal of id
        if(negotiationEntries.length <= 0) throw new InvalidInputError('Enter at least one field of the negotiation to be updated', ['negotiationToBeUpdated'])
        
        //create sql string and arguments list to run query using util function
        const { sql, sqlQueryArgumentList } = createSqlAndArgsForUpdate(negotiationEntries)
        
        //add id to the end of the argument list so it enters as the filter in the sql query
        sqlQueryArgumentList.push(id)

        try {
            //run sql
            const updatedId = await dbGet(sql, sqlQueryArgumentList)
    
            //throw not found error if negotiation id is not in db
            if(!updatedId) throw new NotFoundError('Negotiation not found in our database. Please check the entered id')
            
        } catch (error) {
            //throw not found error if user id is not in db
            checkForeignKeyError(error, 'User not found in our database. Please check entered user id')
            
            //throw error so it can be caught at controller layer
            throw error
        }

    }

    //method for deleting negotiations
    static async delete(id) {
        //sql
        const sql = `DELETE FROM negotiations WHERE id=? RETURNING id`

        //run sql
        const result = await dbGet(sql, [id])

        //throw not found error if id is not in database
        if(!result) throw new NotFoundError('Negotion not found')

    }

}

module.exports = NegotiationDAO