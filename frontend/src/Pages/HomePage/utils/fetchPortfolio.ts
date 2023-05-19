import { BackendRoutes } from "Common/Types"
import IErrorResponse from "Interfaces/IErrorResponse"
import IServerPositionRes from "Interfaces/IServerPositionRes"
import IStock from "Interfaces/IStock"
import { AxiosResponse, AxiosError } from 'axios'
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { handleErrorResponse } from "utils/BackendAPICommunication"
import httpServer from "utils/BackendAPICommunication/httpServer"
import transformErrorInResponse from "utils/BackendAPICommunication/transformErrorInResponse"

function useFetchPortfolio() {
    const navigate = useNavigate()

    return useCallback(async () => {
        const url: BackendRoutes = '/user/portfolio'
        try {
            const response: AxiosResponse<IServerPositionRes[]> = await httpServer.get(url)
            
            const stockListFromServer: IStock[] = response.data.map(position => {
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
            
        } catch (error) {
            const castedError = error as AxiosError
            const axiosResponse = castedError.response
            let errorResponse = transformErrorInResponse(castedError)
            if(axiosResponse) {
                errorResponse = axiosResponse.data as IErrorResponse
                errorResponse.code = axiosResponse.status
                
            }
            await handleErrorResponse(errorResponse, navigate)
        }
        
    }, [navigate]) 
}

export default useFetchPortfolio