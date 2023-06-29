import { SnackbarContext } from "Common/Contexts/SnackbarContext"
import IApiStock from "Interfaces/IApiStock"
import IErrorResponse from "Interfaces/IErrorResponse"
import IFormField from "Interfaces/IFormField"
import { useContext } from "react"
import { fetchStockInfo } from "utils/FinanceAPIComm"

//function that submits form request for stock information to web api
const useSubmitStockConsult = (setStockInfo: React.Dispatch<React.SetStateAction<IApiStock | undefined>>) => {
    //get from context function that allows to use snackbar alerts
    const { activateSnackbar } = useContext(SnackbarContext)

    const successHandler = (apiRes: IErrorResponse | IApiStock[]): void => {
        //guard type to ensure response implements the ApiStock interface
        const apiResIsStockList = (response: IApiStock[] | IErrorResponse): response is IApiStock[] => response instanceof Array && 'currentPrice' in response[0]
        if (apiResIsStockList(apiRes)) {
            //set the state of stock info being displayed by form to the one fetched
            setStockInfo(apiRes[0])
            return
        }

    }

    const errorHandler: ((reason: any) => void | PromiseLike<void>) | null | undefined = err => {
        //in case of error display error message with snackbar and clear displayed stock
        setStockInfo(undefined)
        activateSnackbar(err.message, { colorPalette: 'failure' })
    }

    //function to be used on onSubmit listener of stockConsultForm component
    const submitForm = async (fields: IFormField[]) => {
        //get from form ticker to be fetched
        const stockToSearchInputField = fields.find(field => field.name === 'Stock to check')
        const tickerToFetch = stockToSearchInputField!.value

        //fetch web api for stock info
        try {
            const fetchRes = await fetchStockInfo([tickerToFetch.toString()])
            successHandler(fetchRes)
        } catch (error) {
            errorHandler(error)
        }
    }

    return submitForm
}

export default useSubmitStockConsult