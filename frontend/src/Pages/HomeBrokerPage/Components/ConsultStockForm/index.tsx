import Form from "Components/Form"
import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty } from "utils/FormValidators"
import { useState } from 'react'
import IApiStock from "Interfaces/IApiStock"
import Label from "Components/AtomComponents/Label"
import Paragraph from "Components/AtomComponents/Paragraph"
import useSubmitStockConsult from "./CustomHooks/useSubmitStockConsult"

function StockConsultForm() {
    const [stockInfo, setStockInfo] = useState<IApiStock>()
    
    const formFields:IFormField[] = [
        {
            name: 'Stock to check',
            type: 'text',
            value: '',
            placeholder: 'Enter stock to be searched',
            validators: [fieldIsNotEmpty]
        }
    ]

    const submitForm = useSubmitStockConsult(setStockInfo)
    
    return (
        <>
            <Form fields={formFields} onSubmit={submitForm} submitButtonText="Search Stock"/>
            <Label>Company Name</Label>
            <Paragraph>{stockInfo?.companyName}</Paragraph>
            <Label>Current Price</Label>
            <Paragraph>{stockInfo?.currentPrice.toFixed(2)}</Paragraph>
        </>
    )
}

export default StockConsultForm