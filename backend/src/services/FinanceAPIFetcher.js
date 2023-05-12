//service that communicates with web API to get data on stocks, prime rates, currency and inflation. Documention of the API is in https://brapi.dev/docs

const { default: axios } = require("axios")
const { NotFoundError, InvalidInputError } = require("../CustomErrors")

class FinanceAPIFetcher {
    //create fetcher instance with the base API URL
    static #http = axios.create({
        baseURL: 'https://brapi.dev/api/',
        headers: {
            'Accept': 'application/json'
        },
        timeout: 3000,
        method: 'get'
    })

    //auxiliary function that converts a success response in a list of objects in the desired format
    static #makeStockListFromResponse(response) {
        //get list of stocks from response (check API documentation)
        const listOfStockInfo = response.data.results
        //map a new list which will only contain objects of the desired format
        const listOfDesiredStockInfo = listOfStockInfo.map(stock => {
            //first check if stock was found (it will have a market price if it was) and convert it to the desired format
            if(stock.regularMarketPrice){
                const { symbol, longName, currency, regularMarketPrice } = stock
                return {
                    ticker: symbol,
                    companyName: longName,
                    currency: currency,
                    currentPrice: regularMarketPrice
                }  
            }

            //check if stock was not found (has the error property as true) and return it, changing the name of the symbol property to ticker
            if(stock.error) {
                const { symbol: ticker, ...rest } = stock;
                return { ticker, ...rest };
            }
        })
        return listOfDesiredStockInfo
    }

    //auxiliary validation function that ensures its argument is an array of strings
    static #validateTickerList(tickerList) {
        const throwInvalidArgError = () => {throw new InvalidInputError('Please enter an array of strings as the method argument', ['tickerList'])}
        //validates that the argument is an non-empty array
        const argumentIsNotAnArray = !Array.isArray(tickerList)
        if(argumentIsNotAnArray || tickerList.length === 0) throwInvalidArgError()

        //once the argument is validated as an array, validates that every element in it is a string
        const hasNonStringElements = tickerList.some(ticker => typeof ticker !== 'string')
        if(hasNonStringElements) throwInvalidArgError()
    }

    //method that fetches stock info
    static async fetchStockInfo(tickerList) {
        //validate argument entered: must be an array of strings
        FinanceAPIFetcher.#validateTickerList(tickerList)
        
        //create list of tickers string to be user as parameter by the request
        const requestParam = tickerList.join(',')

        //create endpoint from where to fetch data
        const url = '/quote'
        const endpoint = `${url}/${requestParam}`

        try {
            //make request to API
            const response = await FinanceAPIFetcher.#http.request({ url: endpoint })

            //handle response, converting it from the format returned by the API to the desired format
            return FinanceAPIFetcher.#makeStockListFromResponse(response)

        } catch (error) {
            //check if error was a not found one
            if(error.response.status === 404) throw new NotFoundError(`Ticker ${tickerList[0]} not found`)
            
            //throw error to be caught at controller layer
            throw error
        }
    }

    //method that searches avalilable stocks
    //method that checks prime rates
    //method that checks currency
    //method that checks inflation
}

module.exports = FinanceAPIFetcher