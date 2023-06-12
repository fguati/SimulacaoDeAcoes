import Title from "Components/AtomComponents/Title"
import Form from "Components/Form"
import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty } from "utils/FormValidators"

function HomeBrokerPage() {
    const sellForm: IFormField[] =[
        {
            name: 'Stock to Sell',
            type: 'dropdown',
            selectOptions:['Placeholder 1', 'Placeholder 2', 'Placeholder 3'],
            value: '',
            validators: [fieldIsNotEmpty]
        },
        {
            name: 'Number of Stocks to Sell',
            type: 'number',
            value: 0,
        }
    ]

    const buyForm: IFormField[] =[
        {
            name:'Stock to Buy',
            type: 'text',
            value: '',
        },
        {
            name: 'Number of Stocks to Buy',
            type: 'number',
            value: 0
        }
    ]
    
    const placeholderOnSubmit = (fields: IFormField[]) => {
        console.log(fields[0].value)
    }

    return (
        <>
            <Title>Home Broker</Title>
            <Form fields={buyForm} onSubmit={placeholderOnSubmit} submitButtonText="Buy"/> 
            <Form fields={sellForm} onSubmit={placeholderOnSubmit} submitButtonText="Sell"/>
        </>
    )
}

export default HomeBrokerPage