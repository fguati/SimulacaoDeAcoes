const { NotFoundError, InvalidInputError } = require("../../../../CustomErrors")
const { dbGet } = require("../../../utils/dbutils")

/**
 * auxiliary functions for the NegotiationDAO class
*/
//Validate the filters entered in the select method
const validateFilters = async (filters) => {
    //throw not found error if there is email filter but the entered email is not in users table
    if(filters.userEmail) {
        const userFromEnteredEmail = await dbGet('SELECT * FROM users WHERE email=?', [filters.userEmail])
        if(!userFromEnteredEmail) throw new NotFoundError('User with the entered email was not found in our database')
    }

    //validate that there is only one user filter type
    if(filters.userEmail && filters.userId) {
        throw new InvalidInputError('You cannot filter by user id and email at the same time', ['userId', 'userEmail'])
    }

    //check if startDate comes before endDate
    if(filters.endDate && filters.startDate) {
        const [endDate, startDate] = [new Date(filters.endDate), new Date(filters.startDate)]
        if(endDate.getTime() < startDate.getTime()) {
            throw new InvalidInputError('Start date must come before the end date', [`startDate: ${startDate}`, `endDate: ${endDate}`])
        }
    }
}

//Create sql string and list of arguments to add filters to select method
function createSqlFilterForSelect(filters) {
    const filterSqlList = []
    const valuesToFilterList = []
    let filterSQL = ''

    //function that add filters sqls and values to the lists that will later be used to render the filter sql
    function addFilterToSetup(filterKey) {
        //determine to which sql filter will be applied through the use of a map
        const filterSqlQueryMap = {
            userId: 'user_id=?',
            userEmail: 'user_id=(SELECT id FROM users WHERE email=?)',
            stockTicker: 'stock_ticker=?',
            negotiationType: 'negotiation_type=?',
            startDate: 'negotiation_date>=?',
            endDate: 'negotiation_date<=?'
        }
        
        //add value to be userd in filter in list that will be used as arguments for running the sql
        if(filters[filterKey]) valuesToFilterList.push(filters[filterKey])
        
        //add sql strings to standard filters
        if(filters[filterKey]) filterSqlList.push(filterSqlQueryMap[filterKey])

    }

    //run the addFilterToSetup in all filters to create the lists of sql filter strings and arguments for running the sql query
    const filtersKeys = Object.keys(filters)
    filtersKeys.forEach(filterKey => {
        addFilterToSetup(filterKey)
    })

    //build the final sql filter string
    filterSQL = `WHERE ${filterSqlList.join(' AND ')}`
    
    return { filterSQL, valuesToFilterList }
}

//create sql string and list of arguments to the update method
function createSqlAndArgsForUpdate(negotiationEntries) {
    //object that maps the properties of the entered negotiation object to the columns of the negotiations table in the db
    const propToColMap = {
        id: 'id', 
        userId: 'user_id', 
        stockTicker: 'stock_ticker', 
        negotiatedQty: 'negotiated_qty', 
        negotiatedPrice: 'negotiated_price', 
        negotiationType: 'negotiation_type', 
        negotiationDate: 'negotiation_date' 
    }

    //create fixed componets of the sql query string. Return value is set so it can be checked whether negotiation was found in db
    const baseUpdateSQL = `UPDATE negotiations SET `
    const filterSQL = `WHERE id=?`
    const returnValueSQL = 'RETURNING id'

    //lists of sql updates
    const listOfSqlUpdates = []
    const sqlQueryArgumentList = []

    //go through each query and add an sql query and argument to the lists of sql updates to each
    negotiationEntries.forEach(entry => {
        //get the column that must be updated in the negotiations table in the db
        const [propToUpdate, updatedValue] = entry
        const columnToUpdate = propToColMap[propToUpdate]

        //throw invalid input error if negotiation object arg has property that is invalid
        if(!columnToUpdate) throw new InvalidInputError('One of the properties to update is invalid', [propToUpdate])
        
        //update lists
        listOfSqlUpdates.push(`${columnToUpdate}=?`)
        sqlQueryArgumentList.push(updatedValue)
    })

    //use list of sql update strings and fixed sql components to build final sql
    const allUpdatesSQL = listOfSqlUpdates.join(', ')
    const sql = baseUpdateSQL + allUpdatesSQL + filterSQL + returnValueSQL

    return { sql, sqlQueryArgumentList }
}

module.exports = { validateFilters, createSqlFilterForSelect, createSqlAndArgsForUpdate }