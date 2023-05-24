import { BackendRoutes } from "Common/Types"
import IErrorResponse from "Interfaces/IErrorResponse"
import IServerPositionRes from "Interfaces/IServerPositionRes"
import IStock from "Interfaces/IStock"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { handleErrorResponse } from "utils/BackendAPICommunication"
import fetchFromServer from "utils/BackendAPICommunication/http/httpServerFetch"
import transformErrorInResponse from "utils/BackendAPICommunication/responseHandlers/transformErrorInResponse"


function useFetchPortfolio() {
    const navigate = useNavigate()

    return useCallback(async () => {
        const url: BackendRoutes = '/user/portfolio'
        try {
            const response = await fetchFromServer<IServerPositionRes[]>(url)
            if(response.body && 'length' in response.body){
                const listOfPositions = response.body!
                const stockListFromServer: IStock[] = listOfPositions.map(position => {
                    const stock: IStock = {
                        id: position.stockTicker,
                        companyName: position.stockTicker,//placeholder => pegar de finance API
                        currentPrice: position.averagePrice,//placeholder => pegar de finance API
                        qty: position.qty,
                        ticker: position.stockTicker,
                    }
            
                    stock.totalValue = stock.qty * stock.currentPrice
                    return stock
                })
    
                return stockListFromServer

            }

            throw response
            
        } catch (error) {
            if(error instanceof Error) {
                const errorResponse = transformErrorInResponse(error)
                await handleErrorResponse(errorResponse, navigate)
            }
            
            const errorResponse = error as IErrorResponse
            await handleErrorResponse(errorResponse, navigate)
        }
        
    }, [navigate]) 
}

export default useFetchPortfolio