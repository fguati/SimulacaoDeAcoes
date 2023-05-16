const { NotFoundError } = require("../../CustomErrors");
const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
const FinanceAPIFetcher = require("../../services/FinanceAPIFetcher");
const { validateConstructorArgs, validatePositionIdArgs, validateQty, updateValuesAfterNegotiation, updatePositionOnDb, updateBalanceAfterNegotiation, updateNegotiationHistory } = require("./utils");

//Model for stock porfolio positions
class PositionModel {
    //Properties of position. They are all private since they will only be changed by buy and sell methods
    #userId; #stockTicker; #qty; #averagePrice

    //constructor: receives the stocks ticker, quantity and its average price. Validates the arguments and calculates the total cost
    constructor(userId, stockTicker, qty, averagePrice) {
        //validate arguments entered
        validateConstructorArgs(userId, stockTicker, qty, averagePrice)
        
        this.#userId = userId
        this.#averagePrice = averagePrice
        this.#qty = qty
        this.#stockTicker = stockTicker
    }

    //getPositionInfoFromDB
    static async instanceFromDB(userId, stockTicker) {
        //validate arguments entered
        validatePositionIdArgs(userId, stockTicker)
        
        //get position data from db
        const dbPosition = await PositionDAO.selectByUserId(userId, stockTicker)

        //check if searchd position exists in database
        if(!dbPosition) throw new NotFoundError('Position searched was not found. Please check if the user has this stock in his portfolio')
        
        //create new instance of Position
        const { stock_qty, stock_avg_price } = dbPosition
        const newInstance = new PositionModel(userId, stockTicker, stock_qty, stock_avg_price)

        //return the new instance
        return newInstance
    }

    //userID getter
    get userId() {
        return this.#userId
    }

    //stock getter
    get stockTicker() {
        return this.#stockTicker
    }

    //qty getter
    get qty() {
        return this.#qty
    }

    //average price getter
    get averagePrice() {
        return this.#averagePrice
    }

    //total cost getter
    get totalCost() {
        return this.#qty * this.#averagePrice
    }

    //method that fetches current stock price from API
    async getCurrentPrice() {
        //fetches stock info (API must receive an array of tickers)
        const listOfStockData = await FinanceAPIFetcher.fetchStockInfo([this.#stockTicker])
        const stockData = listOfStockData[0]
        //returns current price found
        return stockData.currentPrice
    }

    //method that buys stock
    async buy(qtyToBuy) {
        //validate qty
        validateQty(qtyToBuy)

        //get current price from external API
        const currentPrice = await this.getCurrentPrice()

        //calculate updated average price, quantity and the total value of the negotiation
        const { newQty, newAveragePrice, negotiationValue } = updateValuesAfterNegotiation(qtyToBuy, currentPrice, this)
        
        //update position data on db
        await updatePositionOnDb(this, newQty, newAveragePrice)

        //update balance in db and, if not possible, revert db modifications
        const newBalance = await updateBalanceAfterNegotiation(this, negotiationValue)

        //insert negotiation in negotiaton history on db
        await updateNegotiationHistory(this, qtyToBuy, currentPrice)

        //update data from position instance
        this.#qty = newQty
        this.#averagePrice = newAveragePrice

        //return new user balance, stock average price and stock quantity
        return {
            userBalance: newBalance,
            stockAveragePrice: this.#averagePrice,
            stockQty: this.#qty
        }
    }
    
    //method that sells stock


}

module.exports = PositionModel