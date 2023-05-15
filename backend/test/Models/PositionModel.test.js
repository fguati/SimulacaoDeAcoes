const { InvalidInputError, NotFoundError } = require("../../src/CustomErrors")
const PositionModel = require("../../src/Models/PositionModel")
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

    test('instanceFromDB must throw not found error if position entered is not in db', async () => {
        function testFunction(userId, stockTicker) {
            return async () => {
                const testPosition = await PositionModel.instanceFromDB(userId, stockTicker)
                return testPosition
            }
        }

        //inexistent user
        await expect(testFunction(99999999, 'ITSA4')).rejects.toThrow(NotFoundError)
        //inexistent position
        await expect(testFunction(19, 'WEGE3')).rejects.toThrow(NotFoundError)

    })
})