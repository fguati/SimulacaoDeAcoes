const NegotiationDAO = require("../../../db/ComunicationDB/NegotiaionDAO")
const PositionDAO = require("../../../db/ComunicationDB/PositionDAO")
const UserDAO = require("../../../db/ComunicationDB/user")

//function that updates the value of the position on the db
async function updatePositionOnDb(position, newQty, newAveragePrice) {
    const positionToUpdate = {
        userId: position.userId, 
        stockTicker: position.stockTicker, 
        stockQty: newQty, 
        stockAvgPrice: newAveragePrice
    }
    await PositionDAO.insertOrUpdate(positionToUpdate)
}

//function that attempts to update balance in db after a trade. This function is used after updating position, so if update fails it undoes the position updating
async function updateBalanceAfterNegotiation(position, negotiationValue) {
    let newBalance
        try {
            //update user balance on db
            newBalance = await UserDAO.updateBalance(position.userId, -1 * negotiationValue)
            return newBalance
            
        } catch (error) {
            //undoes position update in db if balance update fails
            if(position.qty === 0) {
                await PositionDAO.deleteIfExists(position.userId, position.stockTicker)
            } else {
                await updatePositionOnDb(position, position.qty, position.averagePrice)
            }
            throw error
        }
}

//function that adds negotiation to history in db
async function updateNegotiationHistory(position, qtyNegotiated, negotiationPrice, tradeType) {
    const newNegotiation = {
        userId: position.userId, 
        stockTicker: position.stockTicker, 
        negotiatedQty: qtyNegotiated, 
        negotiatedPrice: negotiationPrice, 
        negotiationType: tradeType
    }
    await NegotiationDAO.insert(newNegotiation)
}

module.exports = { updatePositionOnDb, updateBalanceAfterNegotiation, updateNegotiationHistory }