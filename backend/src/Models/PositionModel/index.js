const { InvalidInputError } = require("../../CustomErrors");
const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
const UserDAO = require("../../db/ComunicationDB/user");
const FinanceAPIFetcher = require("../../services/FinanceAPIFetcher");
const { validateConstructorArgs, validatePositionIdArgs, validateQty, updatedValuesAfterNegotiation, updatePositionOnDb, updateBalanceAfterNegotiation, updateNegotiationHistory, validateTradeType } = require("./utils");

//Model for stock porfolio positions
class PositionModel {
    //Properties of position. They are all private since they will only be changed by buy and sell methods
    #userId; #stockTicker; #qty; #averagePrice

    //constructor: receives position row taken from db.
    constructor(dbPosition) {      
        //deconstruct doPosition
        const { user_id, stock_ticker, stock_qty, stock_avg_price } = dbPosition
        
        //validate arguments entered
        validateConstructorArgs(user_id, stock_ticker, stock_qty, stock_avg_price)
        
        this.#userId = user_id
        this.#averagePrice = stock_avg_price
        this.#qty = stock_qty
        this.#stockTicker = stock_ticker
    }

    //getPositionInfoFromDB
    static async instanceFromDB(userId, stockTicker) {
        //validate arguments entered
        validatePositionIdArgs(userId, stockTicker)
        
        //get position data from db
        const dbPosition = await PositionDAO.selectByUserId(userId, stockTicker)

        if(!dbPosition) {
            //throw not found error if user is not in database
            await UserDAO.selectById(userId)
            
            //Instantiate an empty position if position does not exist in db but user does
            const emptyPosition = {
                user_id: userId, 
                stock_ticker: stockTicker, 
                stock_qty: 0, 
                stock_avg_price: 0
            }
            const newInstance = new PositionModel(emptyPosition)
            return newInstance
        } 

        //create new instance of Position with db data
        const newInstance = new PositionModel(dbPosition)
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
        const stockDataResponse = await FinanceAPIFetcher.fetchStockInfo([this.#stockTicker])
        const listOfStockData = stockDataResponse.list
        const stockData = listOfStockData[0]
        //returns current price found
        return stockData.currentPrice
    }

    //method to calculates the current value of the position based in current price
    async getCurrentValue() {
       const currentPrice = await this.getCurrentPrice()
       return currentPrice * this.#qty
    }

    //method for buying and sellings stocks from the position
    async trade(qtyToTrade, tradeType) {
        //validate trade type
        validateTradeType(tradeType)

        //validate qty
        validateQty(qtyToTrade)

        //change quantity to negative if trade is a sale
        const changeToQty = tradeType === 'SELL' ? -1 * qtyToTrade : qtyToTrade

        //get current price from external API
        const currentPrice = await this.getCurrentPrice()

        //calculate updated average price, quantity and the total value of the negotiation
        const { newQty, newAveragePrice, negotiationValue } = updatedValuesAfterNegotiation(changeToQty, currentPrice, this)

        //throw invalid input error if negotiation would lead to negative number of stocks
        if(newQty < 0) throw new InvalidInputError(`User does not have enough ${this.#stockTicker} stocks to make this trade`, ['qtyToTrade'])
        
        //update position data on db
        await updatePositionOnDb(this, newQty, newAveragePrice, tradeType)

        //update balance in db and, if not possible, revert db modifications
        const newBalance = await updateBalanceAfterNegotiation(this, negotiationValue)

        //insert negotiation in negotiaton history on db
        await updateNegotiationHistory(this, qtyToTrade, currentPrice, tradeType)

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

    
}

module.exports = PositionModel