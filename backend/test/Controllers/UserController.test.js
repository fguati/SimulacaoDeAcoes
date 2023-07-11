const UserController = require("../../src/controllers/user");
const UserDAO = require("../../src/db/ComunicationDB/user");
const { createMocks } = require('node-mocks-http');
const { dbAll, dbGet } = require("../../src/db/utils/dbutils");
const FinanceAPIFetcher = require("../../src/services/FinanceAPIFetcher");
const { NotFoundError } = require("../../src/CustomErrors");

const validCredentials = {
    username:'Testget',
    email:'test@get',
    password:'123'
}

const userToBePosted = {
    username: 'TestPostUserController',
    email: 'postuser@controller',
    hashed_password: '123',
    salt:'123'
}

function mockReqResNext() {
    const { req, res } = createMocks();
    req.body = {...validCredentials}
    res.status = (code) => {
        res.statusCode = code    
        return res
    }
    res.send = (body) => {
        res.body = body
        return res
    }
    res.headers = {}
    res.setHeader = (header, value) => {
        res.headers[header] = value
        return res
    }
    res.set = res.setHeader

    const next = jest.fn(param => param)

    return {req, res, next}
}

describe('test the getAll method of the UserController', () => {
    it('returns a non empty list of users', async () => {
        const {req, res, next} = mockReqResNext()
        
        const response = await UserController.getAll(req, res, next)
        const userList = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(userList).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String),
    
        })]))

    })
})

describe('test getOneById method of the UserController', () => {
    it('returns a user if a valid Id is entered', async () => {
        const {req, res, next} = mockReqResNext()

        req.params.id = 1

        const response = await UserController.getOneById(req, res, next)
        const user = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(user).toEqual(expect.objectContaining({
            id: 1,
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String),
        }))
    })

    it('must return an not found error response if id is invalid', async () => {
        const {req, res, next} = mockReqResNext()

        req.params.id = 0

        const notFoundError = await UserController.getOneById(req, res, next)

        expect(next).toBeCalledWith(notFoundError)
        expect(notFoundError.statusCode).toBe(404)
        expect(notFoundError).toEqual(expect.objectContaining({
            name:'NotFoundError',
            message: expect.any(String),
        }))
    })

})

describe('test the postUser method of the user controller', () =>{
    
    it('must insert a user in the db', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = userToBePosted

        const response = await UserController.postUser(req, res, next)
        expect(response.statusCode).toBe(201)
        const userInDb = await UserDAO.selectByEmail(userToBePosted.email)

        expect(userInDb).toEqual(expect.objectContaining({
            email: userToBePosted.email,
            username: userToBePosted.username,
            hashed_password: userToBePosted.hashed_password,
            salt: userToBePosted.salt
        }))

    })

    it('must return invalid input error response if receive an invalid value for either name, email or password', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = userToBePosted
        req.body.email = 'email@notinDB'

        //empty email
        req.body.email = ''
        let invalidError = await UserController.postUser(req, res, next)
         
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = 'email@notinDB'

        //empty name
        req.body.username = ''
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        req.body.username = userToBePosted.username
        
        //empty hashed_password
        req.body.hashed_password = ''
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))

        req.body.hashed_password = userToBePosted.hashed_password
        
        //invalid email
        req.body.email = null
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = 'email@notinDB'

        //invalid name
        req.body.username = null
        invalidError = await UserController.postUser(req, res, next)
         

        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        req.body.username = userToBePosted.username
        
        //invalid password
        req.body.hashed_password = null
        invalidError = await UserController.postUser(req, res, next)
         

        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))

        req.body.hashed_password = userToBePosted.hashed_password
    })

    it('must return an unique constraint error if email already exists in db', async () => {

        const { req, res, next } = mockReqResNext()
        req.body['hashed_password'] = req.body.password
        req.body.salt = '123'
        const uniqueConstraintError = await UserController.postUser(req, res, next)
        expect(uniqueConstraintError.statusCode).toBe(422)
        expect(uniqueConstraintError).toEqual(expect.objectContaining({
            name: 'UniqueConstraintError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

    })
})

describe('test the moveFunds method of the user controller class', () => {
    it('must receive a success response with the new balance in the body', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 17
        const testFundsToDeposit = 200
        const testFundsToWithdraw = -100
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
            funds: testFundsToDeposit
        }

        let response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(200)

        let responseBody = JSON.parse(response.body)

        expect(responseBody).toEqual(expect.objectContaining({
            balance: testFundsToDeposit
        }))

        req.body.funds = testFundsToWithdraw
        response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(200)

        responseBody = JSON.parse(response.body)

        expect(responseBody).toEqual(expect.objectContaining({
            balance: testFundsToDeposit + testFundsToWithdraw
        }))

    })

    it('must return a failure response if the funds to be moved were not sent or had invalid value', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 17
        req.body = {
            payloadJWT: {
                id: testUserId,
            }
        }

        let response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(422)

        expect(response).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))
        
        req.body.funds = 'invalid'

        response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(422)

        expect(response).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))
    })

    it('must return a failure response if the user id was not sent', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = {
            payloadJWT: {
            },
            funds: 100
        }

        let response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(422)

        expect(response).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('id')
        }))
        
        req.body.payloadJWT.id = null

        response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(422)

        expect(response).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('id')
        }))
    })

    it('must return a failure response if the move would lead to negative balance', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 17
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
            funds: -10000000000000000
        }

        let response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(422)

        expect(response).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))
    })

    it('must return a 404 failure response if the user id in the payload is not in the database', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = {
            payloadJWT: {
                id: 9999999
            },
            funds: 100
        }

        let response = await UserController.moveFunds(req, res, next)
        expect(response.statusCode).toBe(404)

        expect(response).toEqual(expect.objectContaining({
            name: 'NotFoundError',
            message: expect.any(String),
        }))
        
    })
})

describe('Test the getPortfolio method of the user controller', () => {
    it('must return an ok response with the user portfolio', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 26
        const dbPortfolio = await dbAll(`SELECT * FROM stock_positions WHERE user_id=?`, [testUserId])
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
        }
    
        let response = await UserController.getPortfolio(req, res, next)
    
        expect(response.statusCode).toBe(200)
    
        let responseBody = JSON.parse(response.body)
    
        responseBody.forEach(position => {
            const { stock_ticker, stock_qty, stock_avg_price } = dbPortfolio.find(dbPosition => dbPosition.stock_ticker === position.stockTicker) //expected position gotten from db
            
            expect(position).toEqual(expect.objectContaining({
                userId: testUserId,
                stockTicker: stock_ticker,
                qty: stock_qty, 
                averagePrice: stock_avg_price
            }))
        })

    })

    it('must return an ok response with an empty list if user has no positions or only empty positions', async () => {
        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testUser) {
            req.body = {
                payloadJWT: {
                    id: testUser,
                },
            }
        
            let response = await UserController.getPortfolio(req, res, next)
        
            expect(response.statusCode).toBe(200)
        
            let responseBody = JSON.parse(response.body)
        
            expect(responseBody).toEqual([])

        }

        const testUserIdWithNoStocks = 10

        await testFunction(testUserIdWithNoStocks)

        const userWithEmptyPOsitions = 27

        await testFunction(userWithEmptyPOsitions)

    })


})

describe('getBalance method', () => {
    it('must return an ok response with user balance', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 26
        const dbUser = await dbAll(`SELECT * FROM users WHERE id=?`, [testUserId])
        const expectedUserBalance = dbUser.user_balance
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
        }
    
        let response = await UserController.getBalance(req, res, next)
    
        expect(response.statusCode).toBe(200)
    
        expect(response.body.balance).toBe(expectedUserBalance)
    })
})

describe('trade method', () => {
    const mockStockPrice = 100

    afterEach(() => {
        jest.clearAllMocks()
    })

    async function testSuccessfulTrade(testUserId, initialBalance, initialQty, qtyToTrade, testStock, tradeType, numberOfNegotiations = 0) {
        const signMultiplier = tradeType === 'BUY' ? 1 : -1
        const expectedUserBalance = initialBalance - signMultiplier * qtyToTrade * mockStockPrice
        const expectedQty = initialQty + signMultiplier * qtyToTrade

        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockResolvedValue({
            list: [{
            ticker: testStock,
            companyName: 'mockName',
            currency: 'BRL',
            currentPrice: mockStockPrice
        }]})

        const { req, res, next } = mockReqResNext()
        
        req.body = {
            stockToTrade: testStock, 
            qtyToTrade: qtyToTrade, 
            tradeType: tradeType,
            payloadJWT: {
                id: testUserId
            }
        }

        const response = await UserController.trade(req, res, next)
        const userPosition = await dbAll(`SELECT * from stock_positions WHERE user_id=? AND stock_ticker=?`, [testUserId, testStock])
        const userBalance = await dbGet(`SELECT * from users WHERE id=?`, [testUserId])
        const negotiations = await dbAll(`SELECT * from negotiations WHERE user_id=? AND stock_ticker=?`, [testUserId, testStock])

        expect(response.statusCode).toBe(200)
        expect(negotiations.length).toBe(numberOfNegotiations + 1)
        expect(userBalance.user_balance).toBe(expectedUserBalance)
        expect(userPosition[0].stock_qty).toBe(expectedQty)
    }

    test('successfully buys stocks', async () => {
        const testUserId = 29
        const testStock = 'WEGE3'
        const qtyToBuy = 20
        
        await testSuccessfulTrade(testUserId, 10000, 0, qtyToBuy, testStock, 'BUY')

        const newBalance = 10000 - qtyToBuy * mockStockPrice
        const newQty = 0 + qtyToBuy

        await testSuccessfulTrade(testUserId, newBalance, newQty, qtyToBuy, testStock, 'BUY', 1)
    })

    test('successfully sells stocks', async () => {
        const testUserId = 30
        const testStock = 'HGRE11'
        const qtyToSell = 20
        const initialBalance = 10000
        const initialQty = 100
        
        await testSuccessfulTrade(testUserId, initialBalance, initialQty, qtyToSell, testStock, 'SELL')

        const newBalance = initialBalance + qtyToSell * mockStockPrice
        const newQty = initialQty - qtyToSell

        await testSuccessfulTrade(testUserId, newBalance, newQty, qtyToSell, testStock, 'SELL', 1)
        
    })

    test('sends invalid input error to next middleware if has any invalid input in the req', async () => {
        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockResolvedValue({
            list: [{
            ticker: 'WEGE3',
            companyName: 'mockName',
            currency: 'BRL',
            currentPrice: mockStockPrice
        }]})

        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testBody) {
            req.body = {
                ...testBody,
                payloadJWT: {
                    id: 30
                }
            }
    
            const response = await UserController.trade(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(response.statusCode).toBe(422)

            expect(response).toEqual(expect.objectContaining({
                name: 'InvalidInputError',
                message: expect.any(String),
            }))

        }

        await testFunction({ stockToTrade: undefined, qtyToTrade: 1, tradeType: 'BUY' })
        await testFunction({ stockToTrade: 'WEGE3', qtyToTrade: undefined, tradeType: 'BUY' })
        await testFunction({ stockToTrade: 'WEGE3', qtyToTrade: 1, tradeType: undefined })
        await testFunction({ stockToTrade: 'WEGE3', qtyToTrade: 'invalid', tradeType: 'BUY' })
        await testFunction({ stockToTrade: 'WEGE3', qtyToTrade: 1, tradeType: 'INVALID' })

    })

    test('sends invalid input error to next middleware if balance is insuficient for trade', async () => {
        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockResolvedValue({
            list: [{
            ticker: 'WEGE3',
            companyName: 'mockName',
            currency: 'BRL',
            currentPrice: mockStockPrice
        }]})

        const testUserId = 29

        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testBody) {
            req.body = {
                ...testBody,
                payloadJWT: {
                    id: testUserId
                }
            }
    
            const response = await UserController.trade(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(response.statusCode).toBe(422)

            expect(response).toEqual(expect.objectContaining({
                name: 'InvalidInputError',
                message: expect.any(String),
            }))

        }

        await testFunction({ stockToTrade: 'WEGE3', qtyToTrade: 1000000, tradeType: 'BUY' })
        const userBalance = await dbGet(`SELECT * FROM users WHERE id=?`, [testUserId])
        expect(userBalance.user_balance).toBeGreaterThan(0)
    })

    test('sends invalid input error to next middleware if stock position quantity is insuficient for trade', async () => {
        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockResolvedValue({
            list: [{
            ticker: 'WEGE3',
            companyName: 'mockName',
            currency: 'BRL',
            currentPrice: mockStockPrice
        }]})

        const testUserId = 30
        const testStock = 'HGRE11'

        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testBody) {
            req.body = {
                ...testBody,
                payloadJWT: {
                    id: testUserId
                }
            }
    
            const response = await UserController.trade(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(response.statusCode).toBe(422)

            expect(response).toEqual(expect.objectContaining({
                name: 'InvalidInputError',
                message: expect.any(String),
            }))

        }

        await testFunction({ stockToTrade: testStock, qtyToTrade: 100, tradeType: 'SELL' })
        const position = await dbGet(`SELECT * FROM stock_positions WHERE user_id=? AND stock_ticker=?`, [testUserId, testStock])
        expect(position.stock_qty).toBeGreaterThan(0)
    })

    test('sends 404 error to next middleware if user id is not in db', async () => {
        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockResolvedValue({
            list: [{
            ticker: 'WEGE3',
            companyName: 'mockName',
            currency: 'BRL',
            currentPrice: mockStockPrice
        }]})

        const testUserId = 9999999
        const testStock = 'HGRE11'

        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testBody) {
            req.body = {
                ...testBody,
                payloadJWT: {
                    id: testUserId
                }
            }
    
            const response = await UserController.trade(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(response.statusCode).toBe(404)

            expect(response).toEqual(expect.objectContaining({
                name: 'NotFoundError',
                message: expect.any(String),
            }))

        }

        await testFunction({ stockToTrade: testStock, qtyToTrade: 100, tradeType: 'SELL' })
    })

    test('sends 404 error to next middleware if user stock ticker is invalid', async () => {
        const mockFetchStockInfo = jest.spyOn(FinanceAPIFetcher, 'fetchStockInfo')
        mockFetchStockInfo.mockImplementation(() => {
            throw new NotFoundError(`Stock not found`)
        })

        const testUserId = 30
        const testStock = 'INVLD7'

        const { req, res, next } = mockReqResNext()
        
        async function testFunction(testBody) {
            req.body = {
                ...testBody,
                payloadJWT: {
                    id: testUserId
                }
            }
    
            const response = await UserController.trade(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(response.statusCode).toBe(404)

            expect(response).toEqual(expect.objectContaining({
                name: 'NotFoundError',
                message: expect.any(String),
            }))

        }

        await testFunction({ stockToTrade: testStock, qtyToTrade: 100, tradeType: 'SELL' })
    })
})

describe('getTradeHistory method', () => {
    it('returns a negotiation list', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 31 //id of user with more than 2 negotiations on test db
        const dbNegotiationHistory = await dbAll(`SELECT * FROM negotiations WHERE user_id=? ORDER BY negotiation_date`, [testUserId])
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
        }
    
        let response = await UserController.getTradeHistory(req, res, next)
        const negotiations = JSON.parse(response.body).negotiations

        expect(response.statusCode).toBe(200)

        negotiations.forEach((negotiation, index) => {
            expect(negotiation).toEqual(expect.objectContaining({
                id: dbNegotiationHistory[index].id,
                tradedStock: dbNegotiationHistory[index].stock_ticker,
                tradedQty: dbNegotiationHistory[index].negotiated_qty,
                tradePrice: dbNegotiationHistory[index].negotiated_price,
                tradeType: dbNegotiationHistory[index].negotiation_type,
                tradeDate: dbNegotiationHistory[index].negotiation_date,
            }))
        })
    })

    it('returns a negotiation list that obeys the pagination parameters', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 31 //id of user with more than 2 negotiations on test db

        const resultsPerPage = 2
        const pageNumber = 2
        const firstResultOfPage = (pageNumber - 1) * resultsPerPage

        const dbNegotiationHistory = await dbAll(`SELECT * FROM negotiations WHERE user_id=? ORDER BY negotiation_date`, [testUserId])
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
        }

        req.query = {
            resultsPerPage: resultsPerPage,
            pageNumber: pageNumber
        }
    
        let response = await UserController.getTradeHistory(req, res, next)
        const negotiations = JSON.parse(response.body).negotiations

        expect(response.statusCode).toBe(200)
        expect(negotiations.length).toBeLessThanOrEqual(resultsPerPage)
        expect(negotiations[0]).toEqual(expect.objectContaining({
            id: dbNegotiationHistory[firstResultOfPage].id,
            tradedStock: dbNegotiationHistory[firstResultOfPage].stock_ticker,
            tradedQty: dbNegotiationHistory[firstResultOfPage].negotiated_qty,
            tradePrice: dbNegotiationHistory[firstResultOfPage].negotiated_price,
            tradeType: dbNegotiationHistory[firstResultOfPage].negotiation_type,
            tradeDate: dbNegotiationHistory[firstResultOfPage].negotiation_date,
        }))

    })

    it('returns an empty list if page number is larger than the supported by the number of entries', async () => {
        const { req, res, next } = mockReqResNext()
        const testUserId = 31 //id of user with more than 2 negotiations on test db

        const resultsPerPage = 2
        const pageNumber = 100
        
        req.body = {
            payloadJWT: {
                id: testUserId,
            },
        }

        req.query = {
            resultsPerPage: resultsPerPage,
            pageNumber: pageNumber
        }
    
        let response = await UserController.getTradeHistory(req, res, next)
        const negotiations = JSON.parse(response.body).negotiations

        expect(response.statusCode).toBe(200)
        expect(negotiations.length).toBe(0)
        
    })
})

