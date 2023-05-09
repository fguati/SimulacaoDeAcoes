const { InvalidInputError, NotFoundError } = require("../../CustomErrors")
const { checkInvalidInputsErrors, checkForeignKeyError } = require("../../utils")
const { dbGet } = require("../utils/dbutils")


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
}

module.exports = NegotiationDAO