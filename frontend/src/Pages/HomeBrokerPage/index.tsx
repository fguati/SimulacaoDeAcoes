import Title from "Components/AtomComponents/Title"
import Form from "Components/Form"
import IFormField from "Interfaces/IFormField"

function HomeBrokerPage() {
    const sellForm: IFormField[] =[
        {
            name: 'Number of Stocks to Sell',
            type: 'number',
            value: 0,
            fieldProperty: 'qtyToSell'
        }
    ]

    const buyForm: IFormField[] =[
        {
            name: 'Number of Stocks to buy',
            type: 'number',
            value: 0,
            fieldProperty: 'qtyToBuy'
        }
    ]
    
    const placeholderOnSubmit = (fields: IFormField[]) => {
        console.log(fields)
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