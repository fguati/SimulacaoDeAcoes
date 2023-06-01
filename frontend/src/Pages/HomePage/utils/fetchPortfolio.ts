import { BackendRoutes } from "Common/Types"
import IApiStock from "Interfaces/IApiStock"
import IErrorResponse from "Interfaces/IErrorResponse"
import IServerPositionRes from "Interfaces/IServerPositionRes"
import IStock from "Interfaces/IStock"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { handleErrorResponse } from "utils/BackendAPICommunication"
import fetchFromServer from "utils/BackendAPICommunication/http/httpServerFetch"
import transformErrorInResponse from "utils/BackendAPICommunication/responseHandlers/transformErrorInResponse"
import { fetchStockInfo } from "utils/FinanceAPIComm"

/**
 * Custom hook that returns function that access the server and return the user portfolio
 */
function useFetchPortfolio() {
    const navigate = useNavigate()

    //use useCallback hook to avoid issues of infinite loops
    return useCallback(async () => {
        const serverAPIURL: BackendRoutes = '/user/portfolio'
        
        try {
            //get user list of positions from backend API
            const serverResponse = await fetchFromServer<IServerPositionRes[]>(serverAPIURL)
            
            //check if server request successfully returned an array
            if(serverResponse.body && 'length' in serverResponse.body){
                const listOfPositions = serverResponse.body!
                
                let stockList: IStock[] = listOfPositions.map(convertPositionToStock)
                
                const tickerList = stockList.map(stock => stock.ticker)

                //fetch stock current info from web API
                const webApiInfo = await fetchStockInfo(tickerList)

                //check if web API request successfully returned an array
                if('length' in webApiInfo) {
                    updateStocksWithApiData(stockList, webApiInfo)

                    return stockList
                }

                //if web API did not return an array it returned an error that must be thrown
                throw webApiInfo

            }

            //if server API did not return an array it returned an error that must be thrown
            throw serverResponse
            
        } catch (error) {
            if(error instanceof Error) {
                const errorResponse = transformErrorInResponse(error)
                return await handleErrorResponse(errorResponse, navigate)
            }
            
            const errorResponse = error as IErrorResponse
            return await handleErrorResponse(errorResponse, navigate)
        }
        
    }, [navigate]) 
}

export default useFetchPortfolio

//aux function that converts the positions that come from the server into a list that implements the stock interface
const convertPositionToStock = (position: IServerPositionRes): IStock => {
    const stock: IStock = {
        id: position.stockTicker,
        companyName: position.stockTicker,
        currentPrice: position.averagePrice,
        qty: position.qty,
        ticker: position.stockTicker,
    }

    stock.totalValue = (stock.qty ?? 0) * stock.currentPrice
    return stock
}

//aux function that updates the data from the stock list with the data fetched from the web API
function updateStocksWithApiData(stockList: IStock[], webApiStockInfo: IApiStock[]) {
    stockList.forEach(stock => {
        const stockInfo = webApiStockInfo.find(apiInfo => apiInfo.ticker === stock.ticker)
        if (stockInfo) {
            stock.companyName = stockInfo.companyName
            stock.currentPrice = stockInfo.currentPrice
            stock.totalValue = (stock.qty ?? 0) * stockInfo.currentPrice
        }
    })
}
