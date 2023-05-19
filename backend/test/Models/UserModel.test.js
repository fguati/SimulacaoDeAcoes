const { InvalidInputError } = require("../../src/CustomErrors")
const PositionModel = require("../../src/Models/PositionModel")
const UserModel = require("../../src/Models/UserModel")
const { dbGet, dbAll } = require("../../src/db/utils/dbutils")
const FinanceAPIFetcher = require("../../src/services/FinanceAPIFetcher")

describe('Test instancing of UserModel class', () => {
    function testPortfolioProp(positionList, userToTest) {
        positionList.forEach(position => {
            const stockTicker = position.stock_ticker
            const stockFromUser = userToTest.portfolioDict[stockTicker]
            expect(stockFromUser).toEqual(expect.objectContaining({
                userId: position.user_id, 
                stockTicker: stockTicker, 
                qty: position.stock_qty, 
                averagePrice: position.stock_avg_price
            }))
        })
    }

    test('constructor must create an object with id, balance and portfolio', () => {
        const testId = 1
        const testBalance = 1000
        const testPortfolio = [
            {
                user_id:testId, 
                stock_ticker: 'WEGE3', 
                stock_qty: 17, 
                stock_avg_price: 25.32
            }, 
            {
                user_id:testId, 
                stock_ticker: 'ITSA4', 
                stock_qty: 25, 
                stock_avg_price: 17.54
            }
        ]
        
        const testUser = new UserModel(testId, testBalance, testPortfolio)
        expect(testUser.id).toBe(testId)
        expect(testUser.balance).toBe(testBalance)
        testPortfolioProp(testPortfolio, testUser)
        
    })

    test('Instance from db must create an object with id, balance and portfolio matching data from db', async () => {
        const testId = 23 //known id from test db
        const expectedBalance = 1000 //value known from test db
        const expectedPortfolio = [
            {
                user_id: 23, 
                stock_ticker: 'BBSE3', 
                stock_qty: 50, 
                stock_avg_price: 22.45
            }, 
            {
                user_id: 23, 
                stock_ticker: 'ITSA3', 
                stock_qty: 27, 
                stock_avg_price: 17.54
            }
        ] //value known from test db
        const testUser = await UserModel.instanceFromDB(testId)

        expect(testUser.id).toBe(testId)
        expect(testUser.balance).toBe(expectedBalance)
        testPortfolioProp(expectedPortfolio, testUser)
    })
})

describe('Test UserModel methods that send requests to finance API', () => {
    test('getTotalAssets method return a value close to the total value', async () => {
        const tolerance = 0.97
        const testId = 23
        const testUser = await UserModel.instanceFromDB(testId)
        const totalUserAssets = await testUser.getTotalAssets()
        const userPortfolio = testUser.portfolio

        let aproximateExpectedTotalAssets = await userPortfolio.reduce(async (acum, currentPosition) => { //expected value cannot be calculated precisely since values of the API may change between requests
            const positionInstance = await PositionModel.instanceFromDB(currentPosition.userId, currentPosition.stockTicker)
            const currentPostitionValue = await positionInstance.getCurrentValue()
            return await acum + currentPostitionValue
        }, 0)

        aproximateExpectedTotalAssets += testUser.balance

        const testRatio = Math.abs(totalUserAssets - aproximateExpectedTotalAssets) / totalUserAssets

        expect(testRatio).toBeLessThanOrEqual(tolerance)
    })
})

describe('Test UserModel methods that query db', () => {
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

    test('moveFunds method must change user balance in db and instance', async () => {
        const testId = 24 //known id from db
        const testFunds = 100
        let expectedBalance = 1000 //data known from db

        const testUser = await UserModel.instanceFromDB(testId)

        async function testMoveFunds(funds) {
            await testUser.moveFunds(funds)
            expectedBalance += funds
            expect(testUser.balance).toBe(expectedBalance)
            const dbUser = await dbGet(`SELECT user_balance FROM users WHERE id=?`, [testUser.id])
            expect(dbUser.user_balance).toBe(expectedBalance)
        }

        await testMoveFunds(testFunds)
        await testMoveFunds(-2 * testFunds)
        
    })

    test('moveFunds method must throw error if funds are not a number', async () => {
        const testId = 24 //known id from db
        const testUser = await UserModel.instanceFromDB(testId)
        
        async function testFunction() {
            await testUser.moveFunds('asdf')
        }

        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })

    test('moveFunds method must throw error if movement would lead user to have negative balance', async () => {
        const testId = 24 //known id from db
        const testUser = await UserModel.instanceFromDB(testId)
        let dbUser = await dbGet(`SELECT user_balance FROM users WHERE id=?`, [testUser.id])
        const initialDbBalance = dbUser.user_balance
        const initialObjBalance = testUser.balance
        
        async function testFunction() {
            await testUser.moveFunds(-100000)
            
        }
        
        await expect(testFunction).rejects.toThrow(InvalidInputError)

        dbUser = await dbGet(`SELECT user_balance FROM users WHERE id=?`, [testUser.id])

        expect(dbUser.user_balance).toBe(initialDbBalance)
        expect(testUser.balance).toBe(initialObjBalance)
    })

    test('trade method calls the FinanceAPI fetcher and changes in the db user balance, stock qty, position average price and negotiation history for an existing position', async () => {
        const originalFetchMethod = FinanceAPIFetcher.fetchStockInfo

        //known values from test db
        const testUserId = 25 
        const testStockFromPortfolioToBuy = 'BBAS3'
        const testStockToSell = 'KNRI11'
        const initialBalance = 10000
        
        //test variables
        const testUser = await UserModel.instanceFromDB(testUserId)
        const qtyToBuy = 10
        const mockCurrentPrice = 4.00
        const today = new Date()
        const testStockNotInPortfolio = 'MGLU3'

        const MockFetchInfo = jest.fn().mockImplementation(async (tickerList) => {
            return {list: tickerList.map(ticker => {
                return {
                    ticker: ticker,
                    companyName: 'testName',
                    currency: 'BRL',
                    currentPrice: mockCurrentPrice
                }
            })}
        })
        FinanceAPIFetcher.fetchStockInfo = MockFetchInfo

        let expectedBalance = initialBalance
        async function testTrade(testStock, qtyToTrade, tradeType) {
            const tradeTypeMultiplier = (tradeType === 'BUY' ? 1: -1)
            const postionOnInstanceBeforeTrade = testUser.portfolioDict[testStock]
            const negotiationValue = qtyToTrade * mockCurrentPrice * tradeTypeMultiplier
            const expectedQty = (postionOnInstanceBeforeTrade ? postionOnInstanceBeforeTrade.qty : 0) + tradeTypeMultiplier * qtyToTrade
            const expectedTotal = 
                tradeType === 'BUY' ? 
                (postionOnInstanceBeforeTrade ? postionOnInstanceBeforeTrade.totalCost : 0) + negotiationValue :
                postionOnInstanceBeforeTrade.averagePrice * expectedQty
            const expectedAvgPrice = tradeType === 'BUY' ? expectedTotal / expectedQty : postionOnInstanceBeforeTrade.averagePrice
            expectedBalance += -1 * negotiationValue

            await testUser.trade(testStock, qtyToTrade, tradeType)
            
            expect(MockFetchInfo).toBeCalledWith([testStock])

            //test data from instance
            const positionOnUserInstance = testUser.portfolioDict[testStock]
            expect(positionOnUserInstance.qty).toBe(expectedQty)
            expect(positionOnUserInstance.averagePrice).toBe(expectedAvgPrice)
            expect(positionOnUserInstance.totalCost).toBeCloseTo(expectedTotal)

            //test data from db
            const user = await getUser(testUserId)
            const history = await getHistoryFromDB(testUserId, testStock)
            const negotiation = history.find(neg => neg.negotiated_qty === qtyToTrade && neg.negotiated_price === mockCurrentPrice)
            const position = await getPosition(testUserId, testStock)

            expect(user.user_balance).toBe(expectedBalance)
            expect(position.stock_qty).toBe(expectedQty)
            expect(position.stock_avg_price).toBe(expectedAvgPrice)
            
            expect(negotiation).toEqual(expect.objectContaining({
                user_id: testUserId, 
                stock_ticker: testStock, 
                negotiated_qty: qtyToTrade, 
                negotiated_price: mockCurrentPrice, 
                negotiation_type: tradeType
            }))
            const negotiationDate = new Date(negotiation.negotiation_date)
            expect(negotiationDate.getDate()).toBe(today.getDate())
            expect(negotiationDate.getMonth()).toBe(today.getMonth())
            expect(negotiationDate.getFullYear()).toBe(today.getFullYear())
        }

        //test buying stock from position already had
        await testTrade(testStockFromPortfolioToBuy, qtyToBuy, 'BUY')

        //test buying stock thats not on portfolio yet
        await testTrade(testStockNotInPortfolio, 37, 'BUY')

        //test selling stock
        await testTrade(testStockToSell, 20, 'SELL')
        
        
        FinanceAPIFetcher.fetchStockInfo = originalFetchMethod
    })

    test('trade method must throw invalid input error if trade would lead to any asset from user to be negative', async () => {
        const idTestuser = 21 // known user from test db
        const existingTestStock = 'HGBS11'//stock known to be in user portfolio
        const stockNotInPorfolio = 'ALZR11'
        const testUser = await UserModel.instanceFromDB(idTestuser)
        const testQtyToBuy = 1 //user has balance 0
        const testQtyToSell = 11 //number known to be bigger than what user has in db
        

        function testErrorFunction(stock, qty, type) {
            return async () => {
                await testUser.trade(stock, qty, type)
            }
        }
        
        function getInfoFromPositionIfExists(position, desiredDataKey) {
            return position ? position[desiredDataKey] : undefined
        }

        async function testFunction(stock, qty, type) {
        let initialPositionData = await PositionModel.instanceFromDB(idTestuser, stock)

        await expect(testErrorFunction(stock, qty, type)).rejects.toThrow(InvalidInputError)

        let negotiationDB = await dbAll(`SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=?`, [idTestuser, stock])
        let userDB = await dbGet(`SELECT * FROM users WHERE id=?`, [idTestuser])
        let positionFromDBAfterFaileTrade = await PositionModel.instanceFromDB(idTestuser, stock)

        const expectedUserBalance = 0 //known values from db
        expect(userDB.user_balance).toBe(expectedUserBalance)
        expect(negotiationDB.length).toBe(0)
        
        const dbPositionAvgPriceToTest= getInfoFromPositionIfExists(positionFromDBAfterFaileTrade, 'averagePrice')
        const dbPositionQty = getInfoFromPositionIfExists(positionFromDBAfterFaileTrade, 'qty')

        const expectedAvgPrice =  getInfoFromPositionIfExists(initialPositionData, 'averagePrice') 
        const expectedQty = getInfoFromPositionIfExists(initialPositionData, 'qty') 

        expect(dbPositionAvgPriceToTest).toBe(expectedAvgPrice) 
        expect(dbPositionQty).toBe(expectedQty) 
        }
        
        //test buying more of a stock from portfolio than user balance allow
        await testFunction(existingTestStock, testQtyToBuy, 'BUY')
        
        //test buying more of a stock out of portfolio than user balance allow
        await testFunction(stockNotInPorfolio, testQtyToBuy, 'BUY')

        //test selling more of a stock than user has in portfolio
        await testFunction(existingTestStock, testQtyToSell, 'SELL')

    })

})