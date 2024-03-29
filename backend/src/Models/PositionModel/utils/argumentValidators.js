const { InvalidInputError } = require("../../../CustomErrors")

//basic validation for each possible argument used in the position model
function validateTicker(stockTicker) {
    if(typeof stockTicker != 'string') throw new InvalidInputError('The stock sticker must be a string', ['stockTicker'])
} 
function validatePrices(price, nameOfFieldValidated) {
    if(isNaN(price)) throw new InvalidInputError(`The ${nameOfFieldValidated} must be a number`, [nameOfFieldValidated])
}
function validateQty(qty) {
    if(!Number.isInteger(qty) || qty < 0) throw new InvalidInputError('The stock quantity must be a positive integer', ['qty'])
}
function validateId(userId) {
    if(!Number.isInteger(userId) || userId < 0) throw new InvalidInputError('The userId must be a positive integer', ['userId'])
}

function validateTradeType(tradeType) {
    const validTradeTypes = ['BUY', 'SELL']
    const typeIsValid = validTradeTypes.includes(tradeType)
    if(!typeIsValid) throw new InvalidInputError('Trade type is not valid', ['tradeType'])
}


//validation of args used in constructor of position model
function validateConstructorArgs(userId, stockTicker, qty, averagaPrice) {
    validateId(userId)
    validateTicker(stockTicker)
    validatePrices(averagaPrice, 'average price')
    validateQty(qty)
}

//validation of arguments that identify a position
function validatePositionIdArgs(userId, stockTicker) {
    validateId(userId)
    validateTicker(stockTicker)
}

module.exports = { validateConstructorArgs, validatePositionIdArgs, validateQty, validateTradeType }