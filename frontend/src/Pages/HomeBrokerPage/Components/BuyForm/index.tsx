import Form from "Components/Form"
import useSubmitTrade from "Pages/HomeBrokerPage/CustomHooks/useSubmitTrade"
import useAddStockValidator from "./CustomHooks/useBuyFormFields"
import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty, stockQtyIsPositive } from "utils/FormValidators"

//form used to purchase stocks
function BuyForm() {
    const baseBuyFormFields: IFormField[] = [
        {
            name:'Stock to Buy',
            type: 'text',
            value: '',
            validators: [fieldIsNotEmpty],
            fieldProperty: 'stockToTrade',
            placeholder: 'Enter the ticker of the stock to buy'
        },
        {
            name: 'Number of Stocks to Buy',
            type: 'number',
            value: 0,
            validators: [stockQtyIsPositive],
            fieldProperty: 'qtyToTrade',
            placeholder: 'Enter the number of stocks to buy'
        }
    ]
    
    const buyFormFields = useAddStockValidator(baseBuyFormFields)

    const submitTrade = useSubmitTrade('BUY')
    
    return (
        <Form fields={buyFormFields} onSubmit={submitTrade} submitButtonText="Buy"/> 
    )
}

export default BuyForm