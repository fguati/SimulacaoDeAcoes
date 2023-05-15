const { InvalidInputError } = require("../CustomErrors");
const FinanceAPIFetcher = require("../services/FinanceAPIFetcher");

class PositionModel {
    //Properties of position. They are all private since they will only be changed by buy and sell methods
    #stockTicker; #qty; #averagePrice

    //constructor: receives the stocks ticker, quantity and its average price. Validates the arguments and calculates the total cost
    constructor(stockTicker, qty, averagePrice) {
        if(typeof stockTicker != 'string') throw new InvalidInputError('The stock sticker must be a string')
        if(isNaN(averagePrice)) throw new InvalidInputError('The average price must be a number', ['averagePrice'])
        if(!Number.isInteger(qty) || qty < 0) throw new InvalidInputError('The stock quantity must be a positive integer', ['qty'])
        
        this.#averagePrice = averagePrice
        this.#qty = qty
        this.#stockTicker = stockTicker
    }

    //getPositionInfoFromDB
    //userID getter

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