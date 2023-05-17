const { InvalidInputError } = require("../../src/CustomErrors")
const PositionModel = require("../../src/Models/PositionModel")
const UserModel = require("../../src/Models/UserModel")
const { dbGet } = require("../../src/db/utils/dbutils")

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
})