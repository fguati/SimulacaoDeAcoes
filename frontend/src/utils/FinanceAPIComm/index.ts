import IApiStock from "Interfaces/IApiStock"
import { ApiResponseStock } from "./interfaces"
import httpFinAPI from "./http"
import { AxiosResponse } from "axios"
import IErrorResponse from "Interfaces/IErrorResponse"
import { handleFinanceAPIError, turnAPIResToStockInfoList } from "./utils"

/**
 * Function that receives a list of tickers, consults web API and return a list of stock info
 */
const fetchStockInfo = async (tickerList: string[]):Promise<IApiStock[] | IErrorResponse> => {
    try {
        //convert ticker list in url parameter
        const tickers = tickerList.join(',')

        //make request to finance API
        const response:AxiosResponse<ApiResponseStock> = await httpFinAPI({url: `/quote/${tickers}`})
        
        //convert response info into a list of stock info
        const filteredList = turnAPIResToStockInfoList(response)
        
        //return info list
        return filteredList

    } catch (error) {
        //return an error object that implements the Error Response interface so it can be treated by hooks
        return handleFinanceAPIError(error)
    }

}


export { fetchStockInfo }
