import { UserBalanceContext } from "Common/Contexts/UserBalanceContext";
import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { useContext } from 'react'

const formFields:IFormField[] =[{
    name: 'Funds to Transfer',
    type: 'number',
    value: ''
}]

//component that renders a form used to post to the server requests to move funds to user balance
function TransferFundsForm() {
    //function that manages the executuin of the funds transfer
    const { postDeposit } = useContext(UserBalanceContext)
    
    //function that calls the postDeposit function with the data from the form
    const submitTransferFunds = (fields: IFormField[]) => {
        const fundsInputField = fields[0]
        const fundsValue = fundsInputField.value 
        postDeposit(Number(fundsValue))
    }
    
    return (
        <Form fields={formFields} onSubmit={submitTransferFunds}/>
    )
}

export default TransferFundsForm