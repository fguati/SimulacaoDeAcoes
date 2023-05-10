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
        valuesToFilterList.push(filters[filterKey])
        
        //add sql strings to standard filters
        filterSqlList.push(filterSqlQueryMap[filterKey])

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

module.exports = { validateFilters, createSqlFilterForSelect}