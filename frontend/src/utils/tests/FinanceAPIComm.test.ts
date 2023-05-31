import IApiStock from "Interfaces/IApiStock"
import IErrorResponse from "Interfaces/IErrorResponse"
import { fetchStockInfo } from "utils/FinanceAPIComm"

describe('fetchStockInfo method of the FinanceAPIComm module', () => {
    it('must return an ok response with relevant info for each ticker', async () => {
        const testTickerList = ['WEGE3', 'ALZR11', 'DISB34']
        const infoList = await fetchStockInfo(testTickerList) as IApiStock[]

        infoList.forEach(stock => {
            expect(stock).toEqual(expect.objectContaining({
                companyName: expect.any(String),
                currentPrice: expect.any(Number),
                ticker: expect.any(String),
                currency: 'BRL'
            }))
        })

        testTickerList.forEach(ticker => {
            const stock = infoList.find(info => info.ticker === ticker)
            expect(stock).not.toBeUndefined()
            expect(stock!.ticker).toBe(ticker)
            expect(stock!.currentPrice).toBeGreaterThan(0)
        })
    })

    it('must return a not found error response if only one ticker is entered and is invalid', async () => {
        const invalidTicker = ['INVLD7']

        const errorResponse = await fetchStockInfo(invalidTicker) as IErrorResponse

        expect(errorResponse).toEqual(expect.objectContaining({
            code: 404,
            name: 'Not Found Error',
            message: expect.any(String)
        }))

    })

    it('must not return item list for invalid tickers', async () => {
        const invalidTicker = 'INVLD7'
        const testTickerList = ['WEGE3', 'ALZR11', 'DISB34', invalidTicker]
        const infoList = await fetchStockInfo(testTickerList) as IApiStock[]

        const invalidStock = infoList.find(stock => stock.ticker === invalidTicker)

        expect(invalidStock).toBeUndefined()
    })
})