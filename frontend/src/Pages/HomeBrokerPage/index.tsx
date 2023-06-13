import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import Title from "Components/AtomComponents/Title"
import Form from "Components/Form"
import IFormField from "Interfaces/IFormField"
import { useContext } from "react"
import { fieldIsNotEmpty } from "utils/FormValidators"

function HomeBrokerPage() {
    const { stockList } = useContext(UserAssetContext)
    
    const sellForm: IFormField[] =[
        {
            name: 'Stock to Sell',
            type: 'dropdown',
            selectOptions: stockList.map(stock => stock.ticker),
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