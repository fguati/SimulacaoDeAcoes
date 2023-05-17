const { InvalidInputError } = require("../../CustomErrors");
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

    //getters
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

    //method that adds or subtract funds from user balance
    async moveFunds(funds) {
        //validate that funds are a number
        if(isNaN(funds)) throw new InvalidInputError('Funds to be moved must be a number', ['funds'])
        //check that movement won't make user balance negative
        if(this.#balance + funds < 0) throw new InvalidInputError('Insuficient funds for withdraw', ['funds'])

        //query db to update for change in balance
        await UserDAO.updateBalance(this.#id, funds)

        //update instance of object with new balance
        this.#balance += funds
    }

    //method that trade stocks
    async trade(stockToTrade, qtyToTrade, tradeType) {
        //look up for stock in portfolio
        let postitionToTrade = this.portfolioDict[stockToTrade]

        //if not found create new instance
        if(!postitionToTrade) postitionToTrade = await PositionModel.instanceFromDB(this.#id, stockToTrade)

        //call trade method from position model
        await postitionToTrade.trade(qtyToTrade, tradeType)

        //if position instance is new, add it to portfolio from this instance
        this.#portfolio.push(postitionToTrade)

    }


}

module.exports = UserModel