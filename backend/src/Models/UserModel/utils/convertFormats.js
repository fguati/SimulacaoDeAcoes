

function convertPositionDBtoObj(positionFromDB) {
    const positionObject = {
        userId: positionFromDB.user_id,
        stockTicker: positionFromDB.stock_ticker,
        qty: positionFromDB.stock_qty,
        averagePrice: positionFromDB.stock_avg_price
    }

    return positionObject
}

module.exports = { convertPositionDBtoObj }