const { NotFoundError, InvalidInputError } = require("../../src/CustomErrors")
const FinanceAPIFetcher = require("../../src/services/FinanceAPIFetcher")

describe('fetchStockInfo method of the FinanceAPIFetcher class', () => {
    it('must return an ok response with relevant info for each ticker', async () => {
        const testStockList = ['WEGE3', 'EGIE3', 'XPML11']
        const listOfStockInfo = await FinanceAPIFetcher.fetchStockInfo(testStockList)
        
        const regexStocks = new RegExp(`/${testStockList.join('|')}/`)

        expect(listOfStockInfo).toEqual(expect.arrayContaining([
            expect.objectContaining({
                ticker: expect.stringMatching(regexStocks),
                companyName: expect.any(String),
                currency: 'BRL',
                currentPrice: expect.any(Number)
            })
        ]))
    })

    it('must throw a not found error if only one ticker is entered and is invalid', async () => {
        async function testFunction() {
            await FinanceAPIFetcher.fetchStockInfo(['INVLD7'])
        }

        await expect(testFunction).rejects.toThrow(NotFoundError)
    })

    it('must have an error object if only one ticker in the list is invalid', async () => {
        const testStockList = ['WEGE3', 'EGIE3', 'INVLD7']
        const listOfStockInfo = await FinanceAPIFetcher.fetchStockInfo(testStockList)
        
        const regexStocks = new RegExp(`${testStockList.join('|')}`)

        listOfStockInfo.forEach(stock => {
            if (stock.currentPrice) {
                expect(stock).toMatchObject({
                    ticker: expect.stringMatching(regexStocks),
                    companyName: expect.any(String),
                    currency: 'BRL',
                    currentPrice: expect.any(Number)
                })
                
            } else {
                expect(stock).toEqual(expect.objectContaining({
                    ticker: expect.stringMatching(regexStocks),
                    error: true,
                    message: expect.any(String)
                }))
            }
        })

    })

    it('must throw an invalid input error if ticker value is not entered or is invalid', async () => {
        function testFunction(invalidTicker) {
            return async () => {
                await FinanceAPIFetcher.fetchStockInfo(invalidTicker)

            }
        }

        await expect(testFunction(null)).rejects.toThrow(InvalidInputError)
        await expect(testFunction()).rejects.toThrow(InvalidInputError)
        await expect(testFunction('invalid')).rejects.toThrow(InvalidInputError)
        await expect(testFunction([])).rejects.toThrow(InvalidInputError)
        await expect(testFunction([7])).rejects.toThrow(InvalidInputError)
    })

})