const { InvalidInputError, NotFoundError } = require("../../src/CustomErrors")
const PositionModel = require("../../src/Models/PositionModel")
const { dbGet, dbRun, dbAll } = require("../../src/db/utils/dbutils")
const FinanceAPIFetcher = require('../../src/services/FinanceAPIFetcher.js')

describe('Test basic properties of PositionModel class', () => {
    const testStock = 'WEGE3'
    const testQty = 3
    const testAvgPrice = 3.87
    const testUserId = 1
    
    const testPosition = new PositionModel(testUserId, testStock, testQty, testAvgPrice)

    it('must have a userId, stockTicker, qty and averagePrice properties that return the values entered in the constructor', () => {
        expect(testPosition.stockTicker).toBe(testStock)
        expect(testPosition.qty).toBe(testQty)
        expect(testPosition.averagePrice).toBe(testAvgPrice)
        expect(testPosition.userId).toBe(testUserId)

    })

    it('must have a totalCost property that must be the product of the qty and averagePrice properties', () => {
        expect(testPosition.totalCost).toBe(testPosition.qty * testPosition.averagePrice)
    })

    test('userId, stockTicker, qty, totalCost and averagePrice properties must not be changeable after object is instantiated', () => {
        testPosition.stockTicker = 'B3SA3'
        expect(testPosition.stockTicker).toBe(testStock)

        testPosition.qty = 50
        expect(testPosition.qty).toBe(testQty)

        testPosition.averagePrice = 17.49
        expect(testPosition.averagePrice).toBe(testAvgPrice)

        testPosition.userId = 2
        expect(testPosition.userId).toBe(testUserId)

        testPosition.totalCost = 2847.23
        expect(testPosition.totalCost).toBe(testPosition.qty * testPosition.averagePrice)

    })

    test('must throw invalid input error if any argument is invalid', () => {
        function testFunction(userId, ticker, qty, avgPrice) {
            return () => {
                new PositionModel(userId, ticker, qty, avgPrice)
            }
        }

        //test user id is not an integer
        expect(testFunction('user', 'WEGE3', 7, 3.08)).toThrow(InvalidInputError)
        //test ticker that is not a string
        expect(testFunction(1, 0, 7, 3.08)).toThrow(InvalidInputError)
        //test negative quantity
        expect(testFunction(1, 'WEGE3', -7, 3.08)).toThrow(InvalidInputError)
        //test decimal quantity
        expect(testFunction(1, 'WEGE3', 7.01, 3.08)).toThrow(InvalidInputError)
        //test price that is not a number
        expect(testFunction(1, 'WEGE3', 7, 'R$ 3.08')).toThrow(InvalidInputError)
    })
})

describe('Test methods from the PositionModel that access the Finance API', () => {
    const testStock = 'WEGE3'
    const testQty = 3
    const testAvgPrice = 3.87
    const testUser = 1
    
    const testPosition = new PositionModel(testUser, testStock, testQty, testAvgPrice)
    
    test('Unit test: method that fetches price from finance API must call the API fetcher method with the ticker of the instance', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        const mockCurrentPrice = 4.00
        const MockFetchInfo = jest.fn().mockImplementationOnce(async (tickerList) => {
            return [{
                ticker: tickerList[0],
                companyName: 'testName',
                currency: 'BRL',
                currentPrice: mockCurrentPrice
            }] 
        })
        
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo

        const mockedFetchedPrice = await testPosition.getCurrentPrice()

        expect(MockFetchInfo).toBeCalledWith(expect.arrayContaining([testStock]))
        expect(mockedFetchedPrice).toBe(mockCurrentPrice)

        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('Integration test: method that fetches price from finance API must return a number', async () => {
        const fetchedPrice = await testPosition.getCurrentPrice()

        expect(fetchedPrice).toEqual(expect.any(Number))
    })

    test('Integration test: method that fetches price must throw a not found error if ticker is non existent', async () => {
        async function testFunction() {
            const invalidPosition = new PositionModel(1, 'INVL7', 1, 1.00)
            await invalidPosition.getCurrentPrice()
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })
    
})

describe('Test methods from the PositionModel that access database', () => {
    async function getHistoryFromDB(userId, stockTicker) {
        const history = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=? ORDER BY negotiation_date DESC`, [userId, stockTicker])
        return history
    }
    async function getPosition(userId, stockTicker) {
        const position = await dbGet(`SELECT * FROM stock_positions WHERE user_id=? AND stock_ticker=?`, [userId, stockTicker])
        return position
    }
    async function getUser(userId) {
        const user = await dbGet(`SELECT * FROM users WHERE id=?`, [userId])
        return user
    }
    async function addFundsToUser(userId, funds) {
        await dbRun(`UPDATE users SET user_balance = user_balance + ${funds} WHERE id =?`, [userId])
    }
    
    test('instanceFromDB must return a PositionModel object with data from database', async () => {
        const testUserId = 19 //user id that exists in db
        const testTicker = 'ITSA4' //ticker that user has
        const testPosition = await PositionModel.instanceFromDB(testUserId, testTicker)

        expect(testPosition).toEqual(expect.objectContaining({
            userId: testUserId,
            stockTicker: testTicker,
            qty: 10, //value from db
            averagePrice: 5.00, //value from db
            totalCost: 50.00 //value calculated from qty and averagaPrice

        }))

    })

    test('instanceFromDB must return an empty position object if user exists in db but does not have the entered stock', async () => {
        const testUserId = 19 //user id that exists in db
        const testTicker = 'WEGE3' //ticker that user does not have
        const testPosition = await PositionModel.instanceFromDB(testUserId, testTicker)

        expect(testPosition).toEqual(expect.objectContaining({
            userId: testUserId,
            stockTicker: testTicker,
            qty: 0,
            averagePrice: 0,
            totalCost: 0

        }))
    })

    test('instanceFromDB must throw Invalid Input error if user id or ticker are invalid', async () => {
        function testFunction(userId, stockTicker) {
            return async () => {
                const testPosition = await PositionModel.instanceFromDB(userId, stockTicker)
                return testPosition
            }
        }

        //invalid user
        await expect(testFunction('user', 'ITSA4')).rejects.toThrow(InvalidInputError)
        //invalid ticker
        await expect(testFunction(19, ['ITSA4'])).rejects.toThrow(InvalidInputError)

    })

    test('instanceFromDB must throw not found error if user entered is not in db', async () => {
        function testFunction(userId, stockTicker) {
            return async () => {
                const testPosition = await PositionModel.instanceFromDB(userId, stockTicker)
                return testPosition
            }
        }

        await expect(testFunction(99999999, 'ITSA4')).rejects.toThrow(NotFoundError)

    })

    test('buy method calls the FinanceAPI fetcher and changes in the db user balance, stock qty, position average price and negotiation history for an existing position', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        const testUserId = 19 //know user from test db
        const testStock = 'BBAS3'// stock know to be had be user in test db
        const initialBalance = 100
        const qtyToBuy = 10
        const mockCurrentPrice = 4.00
        const expectedQty = 15 + qtyToBuy // based on known values from db
        const expectedTotal = 15 * 3 + qtyToBuy * mockCurrentPrice // based on known values from db
        const expectedAvgPrice = expectedTotal / expectedQty
        const expectedBalance = initialBalance - qtyToBuy * mockCurrentPrice
        const today = new Date
        
        await addFundsToUser(testUserId, initialBalance)

        const MockFetchInfo = jest.fn().mockImplementationOnce(async (tickerList) => {
            return [{
                ticker: tickerList[0],
                companyName: 'testName',
                currency: 'BRL',
                currentPrice: mockCurrentPrice
            }] 
        })
        
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo
        const existingPositionToBuy = await PositionModel.instanceFromDB(testUserId, testStock)
        const { userBalance, stockAveragePrice, stockQty } = await existingPositionToBuy.trade(qtyToBuy, 'BUY')
        
        expect(MockFetchInfo).toBeCalledWith([testStock])

        expect(userBalance).toBe(expectedBalance)
        expect(stockAveragePrice).toBe(expectedAvgPrice)
        expect(stockQty).toBe(expectedQty)

        const user = await getUser(testUserId)
        const history = await getHistoryFromDB(testUserId, testStock)
        const negotiation = history.find(neg => neg.negotiated_qty === qtyToBuy && neg.negotiated_price === mockCurrentPrice)
        const position = await getPosition(testUserId, testStock)

        expect(existingPositionToBuy.totalCost).toBe(expectedTotal)
        expect(existingPositionToBuy.qty).toBe(expectedQty)
        expect(existingPositionToBuy.averagePrice).toBe(expectedAvgPrice)

        expect(user.user_balance).toBe(expectedBalance)
        expect(position.stock_qty).toBe(expectedQty)
        expect(position.stock_avg_price).toBe(expectedAvgPrice)
        
        expect(negotiation).toEqual(expect.objectContaining({
            user_id: testUserId, 
            stock_ticker: testStock, 
            negotiated_qty: qtyToBuy, 
            negotiated_price: mockCurrentPrice, 
            negotiation_type: 'BUY'
        }))
        const negotiationDate = new Date(negotiation.negotiation_date)
        expect(negotiationDate.getDate()).toBe(today.getDate())
        expect(negotiationDate.getMonth()).toBe(today.getMonth())
        expect(negotiationDate.getFullYear()).toBe(today.getFullYear())
        
        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('buy method calls the FinanceAPI fetcher and changes in the db user balance, and creacte a new position and negotiation in the db for a new position', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        const testUserId = 20 //known user from test db
        const testStock = 'XPML11'// stock known to not be in users portfolio
        const initialBalance = 100
        const qtyToBuy = 10
        const mockCurrentPrice = 4.00
        const expectedTotal = qtyToBuy * mockCurrentPrice
        const expectedBalance = initialBalance - expectedTotal
        const today = new Date()
        
        await addFundsToUser(testUserId, initialBalance)

        const MockFetchInfo = jest.fn().mockImplementationOnce(async (tickerList) => {
            return [{
                ticker: tickerList[0],
                companyName: 'testName',
                currency: 'BRL',
                currentPrice: mockCurrentPrice
            }] 
        })
        
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo
        const positionToBeCreated = new PositionModel(testUserId, testStock, 0, 0)
        const { userBalance, stockAveragePrice, stockQty } = await positionToBeCreated.trade(qtyToBuy, 'BUY')
        
        expect(MockFetchInfo).toBeCalledWith([testStock])

        expect(userBalance).toBe(expectedBalance)
        expect(stockAveragePrice).toBe(mockCurrentPrice)
        expect(stockQty).toBe(qtyToBuy)

        const user = await getUser(testUserId)
        const history = await getHistoryFromDB(testUserId, testStock)
        const negotiation = history.find(neg => neg.negotiated_qty === qtyToBuy && neg.negotiated_price === mockCurrentPrice)
        const position = await getPosition(testUserId, testStock)

        expect(positionToBeCreated.totalCost).toBe(expectedTotal)
        expect(positionToBeCreated.qty).toBe(qtyToBuy)
        expect(positionToBeCreated.averagePrice).toBe(mockCurrentPrice)

        expect(user.user_balance).toBe(expectedBalance)
        expect(position.stock_qty).toBe(qtyToBuy)
        expect(position.stock_avg_price).toBe(mockCurrentPrice)
        
        expect(negotiation).toEqual(expect.objectContaining({
            user_id: testUserId, 
            stock_ticker: testStock, 
            negotiated_qty: qtyToBuy, 
            negotiated_price: mockCurrentPrice, 
            negotiation_type: 'BUY'
        }))
        const negotiationDate = new Date(negotiation.negotiation_date)
        expect(negotiationDate.getDate()).toBe(today.getDate())
        expect(negotiationDate.getMonth()).toBe(today.getMonth())
        expect(negotiationDate.getFullYear()).toBe(today.getFullYear())
        
        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('buy method must return a not found error if user id is not in db', async () => {
        const idTestuser = 99999
        const testStock = 'HGBS11'
        const newPosition = new PositionModel(idTestuser, testStock, 0, 0)

        async function testFunction() {
            await newPosition.trade(1, 'BUY')
        } 

        const negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, testStock])

        expect(negotiationDB.length).toBe(0)
        await expect(testFunction).rejects.toThrow(NotFoundError)
    })

    test('buy method must return a not found error if stock ticker is not found by external API', async () => {
        const idTestuser = 21 // known user from test db
        const testStock = 'INVLD7'
        const newPosition = new PositionModel(idTestuser, testStock, 0, 0)

        async function testFunction() {
            await newPosition.trade(1, 'BUY')
        } 

        await expect(testFunction).rejects.toThrow(NotFoundError)

        const negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, testStock])
        const userDB = await dbGet(`SELECT * FROM users WHERE id=?`, [idTestuser])

        expect(userDB.user_balance).toBe(0) //user initial balance is known to be 0
        expect(negotiationDB.length).toBe(0)
    })

    test('buy method must throw invalid input error if cost of buying the stocks is larger than user balance', async () => {
        const idTestuser = 21 // known user from test db
        const testStock = 'HGBS11'//stock known to be in user portfolio
        const stockNotInPorfolio = 'ALZR11'
        const positionFromDb = await PositionModel.instanceFromDB(idTestuser, testStock)

        function testFunction(positionToTest) {
            return async () => {
                await positionToTest.trade(1, 'BUY')
            }
        } 

        // //testing with existing position
        await expect(testFunction(positionFromDb)).rejects.toThrow(InvalidInputError)

        let negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, testStock])
        let userDB = await dbGet(`SELECT * FROM users WHERE id=?`, [idTestuser])
        let positionFromDBAfterFailedBuy = await PositionModel.instanceFromDB(idTestuser, testStock)

        expect(userDB.user_balance).toBe(0) //user initial balance is known to be 0
        expect(negotiationDB.length).toBe(0)
        expect(positionFromDBAfterFailedBuy.averagePrice).toBe(21.57) //known values from db
        // expect(positionFromDBAfterFailedBuy.qty).toBe(10) //known values from db

        //testing with new position
        const newPosition = new PositionModel(idTestuser, stockNotInPorfolio, 0, 0)
        await expect(testFunction(newPosition)).rejects.toThrow(InvalidInputError)

        negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, stockNotInPorfolio])
        userDB = await dbGet(`SELECT * FROM users WHERE id=?`, [idTestuser])
        const positionNotCreated = await dbGet(`SELECT * FROM stock_positions WHERE user_id=? AND stock_ticker=?`, [idTestuser, stockNotInPorfolio])

        expect(userDB.user_balance).toBe(0) //user initial balance is known to be 0
        expect(negotiationDB.length).toBe(0)
        expect(positionNotCreated).toBe(undefined)

    })

    test('sell method calls the FinanceAPI fetcher and changes in the db user balance, stock qty and negotiation history for an existing position', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        const initialBalance = 100
        const qtyToSell = 10
        const mockCurrentPrice = 4.00

        const testUserId = 22 //known user from test db
        const testStock = 'ODPV3'// stock known to be had be user in test db
        const dbQty = 100 //values known from test db
        const dbAveragePrice = 32.57 //values known from test db

        const expectedQty = dbQty - qtyToSell 
        const expectedTotal = expectedQty * dbAveragePrice 
        const expectedAvgPrice = dbAveragePrice
        const expectedBalance = initialBalance + qtyToSell * mockCurrentPrice
        const today = new Date()
        
        await addFundsToUser(testUserId, initialBalance)

        const MockFetchInfo = jest.fn().mockImplementationOnce(async (tickerList) => {
            return [{
                ticker: tickerList[0],
                companyName: 'testName',
                currency: 'BRL',
                currentPrice: mockCurrentPrice
            }] 
        })
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo

        const existingPositionToSell = await PositionModel.instanceFromDB(testUserId, testStock)
        const { userBalance, stockAveragePrice, stockQty } = await existingPositionToSell.trade(qtyToSell, 'SELL')
        
        expect(MockFetchInfo).toBeCalledWith([testStock])

        expect(userBalance).toBe(expectedBalance)
        expect(stockAveragePrice).toBe(expectedAvgPrice)
        expect(stockQty).toBe(expectedQty)

        const user = await getUser(testUserId)
        const history = await getHistoryFromDB(testUserId, testStock)
        const negotiation = history.find(neg => neg.negotiated_qty === qtyToSell && neg.negotiated_price === mockCurrentPrice)
        const position = await getPosition(testUserId, testStock)

        expect(existingPositionToSell.qty).toBe(expectedQty)
        expect(existingPositionToSell.averagePrice).toBe(expectedAvgPrice)
        expect(existingPositionToSell.totalCost).toBe(expectedTotal)

        expect(user.user_balance).toBe(expectedBalance)
        expect(position.stock_qty).toBe(expectedQty)
        expect(position.stock_avg_price).toBe(expectedAvgPrice)
        
        expect(negotiation).toEqual(expect.objectContaining({
            user_id: testUserId, 
            stock_ticker: testStock, 
            negotiated_qty: qtyToSell, 
            negotiated_price: mockCurrentPrice, 
            negotiation_type: 'SELL'
        }))
        const negotiationDate = new Date(negotiation.negotiation_date)
        expect(negotiationDate.getDate()).toBe(today.getDate())
        expect(negotiationDate.getMonth()).toBe(today.getMonth())
        expect(negotiationDate.getFullYear()).toBe(today.getFullYear())
        
        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('sell method must throw a not found error if position is not in db', async () => {
        function testFunction(userId, stock) {
            return async () => {
                const position = await PositionModel.instanceFromDB(userId, stock)
                await position.trade(1, 'SELL')
            }
        }
        
        //user not found
        await expect(testFunction(999, 'WEGE3')).rejects.toThrow(NotFoundError)

    })

    test('sell method must return a not found error if stock ticker is not found by external API', async () => {
        const idTestuser = 21 // known user from test db
        const testStock = 'INVLD7'
        const newPosition = new PositionModel(idTestuser, testStock, 0, 0)

        async function testFunction() {
            await newPosition.trade(1, 'SELL')
        } 

        await expect(testFunction).rejects.toThrow(NotFoundError)

        const negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, testStock])
        const userDB = await dbGet(`SELECT * FROM users WHERE id=?`, [idTestuser])

        expect(userDB.user_balance).toBe(0) //user initial balance is known to be 0
        expect(negotiationDB.length).toBe(0)
    })

    test('sell method must throw an invalid input error if qty to sell is larger than the quantity the user has', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        const qtyToSell = 10000
        const mockCurrentPrice = 4.00

        const testUserId = 22 //known user from test db
        const testStock = 'ODPV3'// stock known to be had be user in test db

        const MockFetchInfo = jest.fn().mockImplementationOnce(async (tickerList) => {
            return [{
                ticker: tickerList[0],
                companyName: 'testName',
                currency: 'BRL',
                currentPrice: mockCurrentPrice
            }] 
        })
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo

        const existingPositionToSell = await PositionModel.instanceFromDB(testUserId, testStock)
        
        async function testFunction() {
            await existingPositionToSell.trade(qtyToSell, 'SELL')
        }

        const { qty, averagePrice, totalCost } = existingPositionToSell
        const expectedQty = qty
        const expectedTotal = totalCost
        const expectedAvgPrice = averagePrice

        const { user_balance } = await dbGet(`SELECT user_balance FROM users WHERE id=?`, [testUserId])
        const expectedBalance = user_balance

        await expect(testFunction).rejects.toThrow(InvalidInputError)

        const user = await getUser(testUserId)
        const history = await getHistoryFromDB(testUserId, testStock)
        const position = await getPosition(testUserId, testStock)

        expect(existingPositionToSell.qty).toBe(expectedQty)
        expect(existingPositionToSell.averagePrice).toBe(expectedAvgPrice)
        expect(existingPositionToSell.totalCost).toBe(expectedTotal)

        expect(user.user_balance).toBe(expectedBalance)
        expect(position.stock_qty).toBe(expectedQty)
        expect(position.stock_avg_price).toBe(expectedAvgPrice)
        
        const targetNegotiation = history.find(negotiation => negotiation.negotiated_qty === qtyToSell)
        expect(targetNegotiation).toBe(undefined)
        
        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('trade method must throw invalid input error for invalid trade types', async () => {
        const testUserId = 22 //known user from test db
        const testStock = 'ODPV3'// stock known to be had be user in test db
        const existingPositionToSell = await PositionModel.instanceFromDB(testUserId, testStock)

        async function testFunction() {
            await existingPositionToSell.trade(1, 'Invalid')
        }

        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })


})