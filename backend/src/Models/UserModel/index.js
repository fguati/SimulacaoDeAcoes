const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
const UserDAO = require("../../db/ComunicationDB/user");
const FinanceAPIFetcher = require("../../services/FinanceAPIFetcher");
const PositionModel = require("../PositionModel");

class UserModel {
    #id; #balance; #portfolio
    
    //contructor is private: object should be created with instanceFromDB method. The portfolio property transform the list of position from the db in a list of instances of the PositionModel class
    constructor(id, dbBalance, dbPortfolio) {
        this.#id = id
        this.#balance = dbBalance
        this.#portfolio = dbPortfolio.map(position => new PositionModel(position))
    }

    //method that creates instance with data from db. Every instance of UserModel must be created with this method
    static async instanceFromDB(userId) {
        //get user balance from db
        const dbUser = await UserDAO.selectById(userId) 
        const balance = dbUser.user_balance

        //get user portfolio from db
        let dbPortfolio = await PositionDAO.selectByUserId(userId)

        //instance new user 
        const newUser = new UserModel(userId, balance, dbPortfolio)
        return newUser
    }

    get id() {
        return this.#id
    }
    get balance() {
        return this.#balance
    }
    //portfolio getter: filters out empty positions from the portfolio
    get portfolio() {
        return this.#portfolio.filter(position => position.qty > 0)
    } 

    //portfolio getter: converts the list of positions from the instance into a dictionary for ease of use
    get portfolioDict() {
        //empty object to be portfolio dictionary
        const portfolioDict = {}

        //run through every position in portfolio from db and add it to dictionary
        this.portfolio.forEach(position => {
            //enter in the portfolio dictionary a key with the stock ticker and values from db
            const ticker = position.stockTicker
            portfolioDict[ticker] = position
        })

        //return portfolio object
        return portfolioDict
    }

    //Total assets getter: get current prices for all the stocks in the portfolio and use it to calculate the total assets
    async getTotalAssets() {
        //make list of stock tickers
        const tickerList = this.portfolio.map(position => position.stockTicker)
        
        //fetch the stock data from API
        const stockAPIData = await FinanceAPIFetcher.fetchStockInfo(tickerList)

        //run through list of stocks adding the total value of each position
        let totalAssetValue = this.portfolio.reduce((acum, position) => {
            const currentPositionData = stockAPIData[position.stockTicker]
            const positionCurrentValue = position.qty * currentPositionData['currentPrice']
            return acum + positionCurrentValue
        }, 0)

        //add balance to total asset value
        totalAssetValue += this.balance
        
        return totalAssetValue
    }


}

module.exports = UserModel