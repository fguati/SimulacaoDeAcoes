const { NotFoundError } = require("../../CustomErrors");
const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
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
    //method that sells stock


}

module.exports = PositionModel