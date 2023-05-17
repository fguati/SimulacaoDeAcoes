const PositionDAO = require("../../db/ComunicationDB/PositionDAO");
const UserDAO = require("../../db/ComunicationDB/user");
const { convertPositionDBtoObj } = require("./utils");


class UserModel {
    #id; #balance; #portfolio
    
    //contructor is private: object should be created with instanceFromDB method
    constructor(id, dbBalance, dbPortfolio) {
        this.#id = id
        this.#balance = dbBalance
        this.#portfolio = dbPortfolio
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

    //portfolio getter: converts the list of positions from db into a dictionary for ease of use, filtering out empty positions for simplicity
    get portfolio() {
        //empty object to be portfolio dictionary
        const portfolioDict = {}

        //filter out empty position from db portfolio
        const filteredPortfolio = this.#portfolio.filter(position => position.stock_qty > 0)

        //run through every position in portfolio from db and add it to dictionary
        filteredPortfolio.forEach(position => {
            //enter in the portfolio dictionary a key with the stock ticker and values from db
            const ticker = position.stock_ticker
            portfolioDict[ticker] = convertPositionDBtoObj(position)
        })

        //return portfolio object
        return portfolioDict
    }


}

module.exports = UserModel