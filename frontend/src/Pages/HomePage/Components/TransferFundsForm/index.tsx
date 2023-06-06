import { UserBalanceContext } from "Common/Contexts/UserBalanceContext";
import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { useContext } from 'react'

const formFields:IFormField[] =[{
    name: 'Funds to Transfer',
    type: 'number',
    value: ''
}]


function TransferFundsForm() {
    const { postDeposit } = useContext(UserBalanceContext)
    
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