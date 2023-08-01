const { listInvalidInputs } = require('../utils')

const UserDAO = require('../db/ComunicationDB/user.js');
const { InvalidInputError } = require('../CustomErrors');
const { hasInvalidParam } = require('../utils');
const UserModel = require('../Models/UserModel');
const { sendOKResponse } = require('./utils');
const NegotiationDAO = require('../db/ComunicationDB/NegotiaionDAO');

class UserController {
    static async getAll(req, res, next) {
        try {
            const listOfUsers = await UserDAO.select();
            return sendOKResponse(res, listOfUsers)
        } catch (error) {
            return next(error)
        }
    }

    static async getOneById(req, res, next) {
        const id = req.params.id
        try {
            const user = await UserDAO.selectById(id)

            if (!user) {
                return next(new InvalidInputError("Id not found", [id]))
            }

            return sendOKResponse(res, user)

        } catch (error) {
            return next(error)
        }
    }

    static async postUser(req, res, next) {
        const userPropertyNames = ['username', 'email', 'salt', 'hashed_password']
        try {
            const newUser = req.body
            const userPropsReceived = userPropertyNames.map(key => newUser[key])

            if (hasInvalidParam(userPropsReceived)) {
                const invalidInputs = listInvalidInputs(newUser, userPropertyNames)
                const invalidInputError = new InvalidInputError('Invalid user information', invalidInputs)
                return next(invalidInputError)
            }

            await UserDAO.insert(newUser)
            return sendOKResponse(res, { message: 'User created successfully' }, 201)

        } catch (error) {
            return next(error)
        }
    }

    //method that deposits or withdraws funds from user balance
    static async moveFunds(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if (!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //get funds moved from request body
            const { funds } = req.body

            //check if request body has the value of funds to be deposited or withdrawn
            if (isNaN(funds)) throw new InvalidInputError('Valid funds to be moved were not sent in http request', ['funds'])

            //send operation to database
            const balance = await UserDAO.updateBalance(id, funds)
            //send success response
            return sendOKResponse(res, { balance })

        } catch (error) {
            //send error to error treating middleware
            return next(error)
        }
    }

    //method that returns the user full portfolio
    static async getPortfolio(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if (!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //instance user model
            const user = await UserModel.instanceFromDB(id)

            //send success response with portfolio provided by user model
            return sendOKResponse(res, user.portfolio)

        } catch (error) {
            //send error to error treating middleware
            return next(error)
        }
    }

    //method that returns the user balance
    static async getBalance(req, res, next) {
        try {
            //get user id from jwt payload
            const { id } = req.body.payloadJWT

            //check if user id was sent in jwt payload in the req body
            if (!id) throw new InvalidInputError('User id was not sent in http request', ['id'])

            //instance user model
            const user = await UserModel.instanceFromDB(id)

            //send success response with balance provided by user model
            return sendOKResponse(res, { balance: user.balance })

        } catch (error) {
            //send error to error treating middleware
            return next(error)
        }
    }

    //method that trades stocks
    static async trade(req, res, next) {
        try {
            //get info from req
            const { id } = req.body.payloadJWT
            const { stockToTrade, qtyToTrade, tradeType } = req.body

            //instantiate the User class with id from JWT payload caried in the body
            const user = await UserModel.instanceFromDB(id)

            //call trade method from user class
            const updatedInfo = await user.trade(stockToTrade, Number(qtyToTrade), tradeType)

            //return new balance and stock position with response
            const tradeData = {
                userBalance: updatedInfo.userBalance,
                newPosition: {
                    stock: stockToTrade,
                    qty: updatedInfo.stockQty,
                    averagePrice: updatedInfo.stockAveragePrice
                }
            }

            return sendOKResponse(res, tradeData)

        } catch (error) {
            //send caught error to be processed in the error handler middleware
            return next(error)
        }
    }

    //method that gets the user trade history
    static async getTradeHistory(req, res, next) {
        try {
            //get user id from JWT payload
            const { id } = req.body.payloadJWT

            //get filters from request
            const { stockFilter, typeFilter, startDateFilter, endDateFilter } = req.query.filters ?? {}
            const filters = { userId: id, stockTicker: stockFilter, negotiationType: typeFilter, startDate: startDateFilter, endDate: endDateFilter }

            //make the arguments for the db query from the pagination parameters from request
            const { limitOfResults, offsetResults } = makeSqlPaginationArgs(req);

            //query db for negotiation history
            const dbNegotiationHistory = await NegotiationDAO.select(filters, limitOfResults, offsetResults)

            //query to get number of pages that exist fro the previous query
            const numberOfResults = await NegotiationDAO.countEntries(filters)
            const numberOfPages = Math.ceil(numberOfResults.number_of_entries / limitOfResults)

            //Create response object (list of negotiation objects)
            const tradeHistory = createTradeHistoryReturnObj(dbNegotiationHistory, numberOfPages)

            //send success response with page number and list of negotiations
            return sendOKResponse(res, tradeHistory)

        } catch (error) {
            // send error to error treating middleware
            return next(error)
        }
    }

}

module.exports = UserController;

function makeSqlPaginationArgs(req) {
    //get pagination parameters from request
    const { resultsPerPage, pageNumber } = req.query

    //Use 100 as the default results per page
    const limitOfResults = resultsPerPage ?? 100;

    //Calculate how many results must be skiped based on the page being returned, while setting page 1 as default
    const offsetResults = ((pageNumber ?? 1) - 1) * limitOfResults;

    return { limitOfResults, offsetResults };
}

function createTradeHistoryReturnObj(dbNegotiationHistory, numberOfPages) {
    
    //aux function that takes the neogtiation data received from the a db row and converts to an object that implements the INegotiation interface
    const turnDbTradeToINegotiaion = negotiation => {
        // eslint-disable-next-line no-unused-vars
        const { id, negotiation_date, negotiated_qty, stock_ticker, negotiated_price, negotiation_type } = negotiation;
        return {
            id,
            tradeDate: negotiation_date,
            tradedQty: negotiated_qty,
            tradedStock: stock_ticker,
            tradePrice: negotiated_price,
            tradeType: negotiation_type
        };
    };

    return {
        negotiations: dbNegotiationHistory.map(turnDbTradeToINegotiaion),
        numberOfPages
    };
}
