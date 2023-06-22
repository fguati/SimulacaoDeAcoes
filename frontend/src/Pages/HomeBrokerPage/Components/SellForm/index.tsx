import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty, stockQtyIsPositive } from "utils/FormValidators"
import Form from "Components/Form"
import useSubmitTrade from "Pages/HomeBrokerPage/CustomHooks/useSubmitTrade"
import useAddPortfolioAsSelectOptions from "./Custom Hooks/useAddSelectOptions"

function SellForm() {
    const baseSellFormFields: IFormField[] =[
        {
            name: 'Stock to Sell',
            type: 'dropdown',
            selectOptions: [],
            value: '',
            validators: [fieldIsNotEmpty],
            fieldProperty: 'stockToTrade',
        },
        {
            name: 'Number of Stocks to Sell',
            type: 'number',
            value: 0,
            validators: [stockQtyIsPositive],
            fieldProperty: 'qtyToTrade',
            placeholder: 'Enter the number of stocks to sell'
        }
    ]

    const sellForm = useAddPortfolioAsSelectOptions(baseSellFormFields)

    const submitTrade = useSubmitTrade('SELL')
    
    return (
        <Form fields={sellForm} onSubmit={submitTrade} submitButtonText="Sell"/>
    )
}

export default SellForm