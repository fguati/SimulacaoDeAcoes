import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty, useStockExistsValidator } from "utils/FormValidators"
import { useEffect, useRef } from 'react'

//custom hook that adds the stock exists validator to the buy form fields and keeps it updated
const useAddStockValidator = (buyForm: IFormField[]) => {
    //renders function that validates whether a stock exists
    const stockExistsValidator = useStockExistsValidator()

    //reference to the form fields which will allow it to be updated whenever the fundsValidator function is re-rendered
    const formFieldsRef = useRef(buyForm)

    //effect that updates the form fields whenever the validator is updated as well
    useEffect(() => {
        const stock2BuyField = formFieldsRef.current.find(field => field.name === 'Stock to Buy')
        stock2BuyField!.validators = [fieldIsNotEmpty, stockExistsValidator]
    }, [stockExistsValidator])

    return buyForm
}

export default useAddStockValidator