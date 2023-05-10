const { InvalidInputError, NotFoundError } = require("../../../CustomErrors")
const { checkInvalidInputsErrors, checkForeignKeyError } = require("../../../utils")
const { dbGet, dbAll } = require("../../utils/dbutils")
const { validateFilters, createSqlFilterForSelect } = require("./utils")

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

    //method for getting multiple entries from the negotiation table, with optional filters
    static async select(filters = null) {        
        //base select sql
        let baseSQL = `SELECT * FROM negotiations `
        
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
        const sql = baseSQL + filterSQL + ';'

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
        const { id } = negotiationToBeUpdated
        //check if it has id
        if(!id) throw new InvalidInputError('The update method requires the id of the negotiotion to be updated', ['negotiationToBeUpdated.id'])
        
        const propToColMap = {
            id: 'id', 
            userId: 'user_id', 
            stockTicker: 'stock_ticker', 
            negotiatedQty: 'negotiated_qty', 
            negotiatedPrice: 'negotiated_price', 
            negotiationType: 'negotiation_type', 
            negotiationDate: 'negotiation_date' 
        }

        const negotiationEntries = Object.entries(negotiationToBeUpdated)
        const idIndex = negotiationEntries.findIndex(entry => entry[0] === 'id')
        negotiationEntries.splice(idIndex, 1)
        
        //check if it has at least one column besides id
        if(negotiationEntries.length <= 0) throw new InvalidInputError('Enter at least one field of the negotiation to be updated', ['negotiationToBeUpdated'])

        //build sql and list of aguments
        const baseSQL = `UPDATE negotiations SET `
        const filterSQL = `WHERE id=?`
        const returnValueSQL = 'RETURNING id'
        const listOfSqlUpdates = []
        const sqlQueryArgumentList = []
        negotiationEntries.forEach(entry => {
            const [propToUpdate, updatedValue] = entry
            const columnToUpdate = propToColMap[propToUpdate]
            //throw invalid input error if negotiation object arg has property that is invalid
            if(!columnToUpdate) throw new InvalidInputError('One of the properties to update is invalid', [propToUpdate])
            listOfSqlUpdates.push(`${columnToUpdate}=?`)
            sqlQueryArgumentList.push(updatedValue)
        })

        const updateSQL = listOfSqlUpdates.join(', ')

        const sql = baseSQL + updateSQL + filterSQL + returnValueSQL
        sqlQueryArgumentList.push(id)

        try {
            //run sql
            const updatedId = await dbGet(sql, sqlQueryArgumentList)
    
            //throw not found error if id not in db
            if(!updatedId) throw new NotFoundError('Negotiation not found in our database. Please check the entered id')
            
        } catch (error) {
            //throw not found error if user id is not in db
            checkForeignKeyError(error, 'User not found in our database. Please check entered user id')
            
            //throw error so it can be caught at controller layer
            throw error
        }


    }

}

module.exports = NegotiationDAO