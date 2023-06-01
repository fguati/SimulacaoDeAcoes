import { AxiosError, AxiosResponse } from "axios"
import { ApiResponseStock } from "../interfaces"
import IApiStock from "Interfaces/IApiStock"
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"

function turnAPIResToStockInfoList(response: AxiosResponse<ApiResponseStock, any>) {
    //get the API data from the response
    const apiStockInfo = response.data.results

    //convert the API data to the ApiStock interface
    const stockInfoList: IApiStock[] = apiStockInfo.map(info => ({
        companyName: info.longName,
        currency: info.currency,
        currentPrice: info.regularMarketPrice,
        ticker: info.symbol
    }))

    //maybe give list of invalid tickers so it can be snackBar'd?
    //filter out stocks with missing info (this will also filter out queries that resulted in errors)
    const filteredList = stockInfoList.filter(info => (
        info.companyName &&
        info.currency &&
        info.currentPrice &&
        info.ticker
    ))

    return filteredList
}

function handleFinanceAPIError(error: unknown) {
    let errorResponse = unknownError

    if (error instanceof AxiosError) {
        if (error.response) {
            if (error.response.status === 404) {
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

export { handleFinanceAPIError, turnAPIResToStockInfoList }