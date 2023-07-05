import Form from "Components/Form"
import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty } from "utils/FormValidators"
import { useState } from 'react'
import IApiStock from "Interfaces/IApiStock"
import Label from "Components/AtomComponents/Label"
import Paragraph from "Components/AtomComponents/Paragraph"
import useSubmitStockConsult from "./CustomHooks/useSubmitStockConsult"
import styled from "styled-components"
import { displayMonetaryValue } from "utils/displayFunctions"

const StockDataContainer = styled.div`
    margin: var(--default-spacing);
    display: flex;
    flex-direction: column;
    gap: var(--default-spacing);
`

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

            <StockDataContainer>
                <Label>Company Name</Label>
                <Paragraph>{stockInfo?.companyName}</Paragraph>
            </StockDataContainer>

            <StockDataContainer>
                <Label>Current Price</Label>
                <Paragraph>{stockInfo ? displayMonetaryValue(stockInfo.currentPrice): ''}</Paragraph>
            </StockDataContainer>
        </>
    )
}

export default StockConsultForm