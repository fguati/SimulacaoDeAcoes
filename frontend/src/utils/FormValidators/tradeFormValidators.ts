import { useCallback, useEffect, useState } from "react"
import { FormValidator, IValidatorReturn } from "."
import { fetchAvailableStockList } from "utils/FinanceAPIComm"

//check stock entered in form exists in list that should be obtained from web API
export const stockExists = (existingStocks: string[]):FormValidator => {
    return (stockToCheckTicker) => {
        const validatorReturnObject: IValidatorReturn = {
            valid: true
        }

        //in case API does not return the list, validation is skipped
        if(!existingStocks || existingStocks.length === 0) return validatorReturnObject
    
        const stockInExistingStocks = existingStocks.some(existingStock => stockToCheckTicker === existingStock)

        if(!stockInExistingStocks) {
            validatorReturnObject.valid = false
            validatorReturnObject.message = `can't receive ticker ${stockToCheckTicker}, which was not found`
        }
    
        return validatorReturnObject
    }
}

//check quantity of stocks being negotiated is positive
export const stockQtyIsPositive:FormValidator = (qty) => {
    const validatorReturnObject: IValidatorReturn = {
        valid: true
    }

    if(Number(qty) < 0) {
        validatorReturnObject.valid = false
        validatorReturnObject.message = 'Please put a positive number of stocks to be traded'
    }

    return validatorReturnObject
}

//hook that renders and keeps updated the stock checker validator
export const useStockExistsValidator = () => {
    const [existingStocks, setExistingStocks] = useState<string[]>([])
    
    //create list of exiting stocks by consulting web API
    useEffect(() => {
        fetchAvailableStockList().then(list =>  setExistingStocks(list))
    }, [])

    //create the validator function with the useCallback hook so the it updates whenever the existing stock list changes
    const stockValidator = useCallback((value: string | number) =>  stockExists(existingStocks)(value), [existingStocks])

    return stockValidator
}
