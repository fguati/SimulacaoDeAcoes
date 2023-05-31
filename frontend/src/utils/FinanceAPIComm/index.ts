import IApiStock from "Interfaces/IApiStock"
import { ApiResponseStock } from "./interfaces"
import httpFinAPI from "./http"
import { AxiosError, AxiosResponse } from "axios"
import IErrorResponse from "Interfaces/IErrorResponse"
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"

const fetchStockInfo = async (tickerList: string[]):Promise<IApiStock[] | IErrorResponse> => {
    try {
        //convert ticker list in url parameter
        const tickers = tickerList.join(',')

        //make request to finance API
        const response:AxiosResponse<ApiResponseStock> = await httpFinAPI({url: `/quote/${tickers}`})
        const apiInfo = response.data.results

        //map response info to a list of stock info
        const infoList:IApiStock[] =  apiInfo.map(info => ({
            companyName: info.longName,
            currency: info.currency,
            currentPrice: info.regularMarketPrice,
            ticker: info.symbol
        }))

        //maybe give list of invalid tickers so it can be snackBar'd?
        //filter out stocks with missing info
        const filteredList = infoList.filter(info => (
            info.companyName &&
            info.currency &&
            info.currentPrice &&
            info.ticker
        ))
        
        //return info list
        return filteredList

    } catch (error) {
        let errorResponse = unknownError

        if(error instanceof AxiosError) {
            if(error.response) {
                if(error.response.status === 404){
                    errorResponse = {
                        code: 404,
                        name: 'Not Found Error',
                        message: 'Could not find an asset with the entered ticker'
                    }
                }

            }
        }

        return errorResponse
    }

}


export { fetchStockInfo }