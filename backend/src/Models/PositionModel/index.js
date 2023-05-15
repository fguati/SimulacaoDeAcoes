const { NotFoundError } = require("../../CustomErrors");
const NegotiationDAO = require("../../db/ComunicationDB/NegotiaionDAO");
const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
const UserDAO = require("../../db/ComunicationDB/user");
const FinanceAPIFetcher = require("../../services/FinanceAPIFetcher");
const { validateConstructorArgs, validatePositionIdArgs } = require("./utils/argumentValidators");

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

        //get current price from external API
        const currentPrice = await this.getCurrentPrice()

        //calculate updated average price
        const negotiationValue = qtyToBuy * currentPrice
        const newTotalCost = negotiationValue + this.totalCost
        const newQty = qtyToBuy + this.qty
        const newAveragePrice = newTotalCost / newQty

        //update position data on db
        const positionToUpdate = {
            userId: this.#userId, 
            stockTicker: this.#stockTicker, 
            stockQty: newQty, 
            stockAvgPrice: newAveragePrice
        }
        await PositionDAO.insertOrUpdate(positionToUpdate)

        //try to update balance and, in case its not possible, revert changes in Position in db
        let newBalance
        try {
            //update user balance on db
            newBalance = await UserDAO.updateBalance(this.#userId, -1 * negotiationValue)
            
        } catch (error) {
            if(this.#qty === 0) {
                await PositionDAO.deleteIfExists(this.#userId, this.#stockTicker)
            } else {
                await PositionDAO.insertOrUpdate({ 
                    userId: this.#userId,
                    stockTicker: this.#stockTicker,
                    stockQty: this.#qty,
                    stockAvgPrice: this.#averagePrice
                })
            }
            throw error
        }

        //insert negotiation in negotiaton history on db
        const newNegotiation = {
            userId: this.#userId, 
            stockTicker: this.#stockTicker, 
            negotiatedQty: qtyToBuy, 
            negotiatedPrice: currentPrice, 
            negotiationType: 'BUY'
        }
        await NegotiationDAO.insert(newNegotiation)

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