import { BackendRoutes } from "Common/Types"
import IErrorResponse from "Interfaces/IErrorResponse"
import IServerPositionRes from "Interfaces/IServerPositionRes"
import IStock from "Interfaces/IStock"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { handleErrorResponse } from "utils/BackendAPICommunication"
import fetchFromServer from "utils/BackendAPICommunication/http/httpServerFetch"
import transformErrorInResponse from "utils/BackendAPICommunication/responseHandlers/transformErrorInResponse"

/**
 * Custom hook that returns function that access the server and return the user portfolio
 */
function useFetchPortfolio() {
    const navigate = useNavigate()

    return useCallback(async () => {
        const url: BackendRoutes = '/user/portfolio'
        
        try {
            const response = await fetchFromServer<IServerPositionRes[]>(url)
            
            if(response.body && 'length' in response.body){
                const listOfPositions = response.body!
                
                const stockList: IStock[] = listOfPositions.map(convertPositionToStock)
    
                return stockList

            }

            throw response
            
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

const convertPositionToStock = (position: IServerPositionRes): IStock => {
    const stock: IStock = {
        id: position.stockTicker,
        companyName: position.stockTicker, //provisorio/placeholder. trocar quando fizer fetch para Finance API
        currentPrice: position.averagePrice, //provisorio/placeholder. trocar quando fizer fetch para Finance API
        qty: position.qty,
        ticker: position.stockTicker,
    }

    stock.totalValue = stock.qty * stock.currentPrice
    return stock
}

export default useFetchPortfolio