//function that calculates values tied to a stock trade: new average price and stock quantities after the trade, as well as trade total value
function updatedValuesAfterNegotiation(qtyNegotiated, negotiationPrice, positionBeingNegotiated) {
    const negotiationValue = qtyNegotiated * negotiationPrice
    const newQty = qtyNegotiated + positionBeingNegotiated.qty

    //Average price is only changed in case of buying more stocks (positive quantity). In this case it will be the new total cost divided by the new quantity
    const newTotalCost = negotiationValue + positionBeingNegotiated.totalCost
    const newAveragePrice = qtyNegotiated > 0 ? newTotalCost / newQty : positionBeingNegotiated.averagePrice

    return { newQty, newAveragePrice, negotiationValue }
}

module.exports = { updatedValuesAfterNegotiation }