const { InvalidInputError } = require("../../src/CustomErrors")
const PositionModel = require("../../src/Models/PositionModel")

describe('Test basic properties of PositionModel class', () => {
    const testStock = 'WEGE3'
    const testQty = 3
    const testAvgPrice = 3.87
    
    const testPosition = new PositionModel(testStock, testQty, testAvgPrice)

    it('must have a stockTicker, qty and averagePrice properties that return the values entered in the constructor', () => {
        expect(testPosition.stockTicker).toBe(testStock)
        expect(testPosition.qty).toBe(testQty)
        expect(testPosition.averagePrice).toBe(testAvgPrice)

    })

    it('must have a totalCost property that must be the product of the qty and averagePrice properties', () => {
        expect(testPosition.totalCost).toBe(testPosition.qty * testPosition.averagePrice)
    })

    test('stockTicker, qty, totalCost and averagePrice properties must not be changeable after object is instantiated', () => {
        testPosition.stockTicker = 'B3SA3'
        expect(testPosition.stockTicker).toBe(testStock)

        testPosition.qty = 50
        expect(testPosition.qty).toBe(testQty)

        testPosition.averagePrice = 17.49
        expect(testPosition.averagePrice).toBe(testAvgPrice)

        testPosition.totalCost = 2847.23
        expect(testPosition.totalCost).toBe(testPosition.qty * testPosition.averagePrice)

    })

    test('must throw invalid input error if any argument is invalid', () => {
        function testFunction(ticker, qty, avgPrice) {
            return () => {
                new PositionModel(ticker, qty, avgPrice)
            }
        }

        //test ticker that is not a string
        expect(testFunction(0, 7, 3.08)).toThrow(InvalidInputError)
        //test negative quantity
        expect(testFunction('WEGE3', -7, 3.08)).toThrow(InvalidInputError)
        //test decimal quantity
        expect(testFunction('WEGE3', 7.01, 3.08)).toThrow(InvalidInputError)
        //test price that is not a number
        expect(testFunction('WEGE3', 7, 'R$ 3.08')).toThrow(InvalidInputError)
    })
})