import { UserBalanceContext } from "Common/Contexts/UserBalanceContext";
import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { useCallback, useContext } from 'react'
import { fundsAreSuficientForWithdraw } from "utils/FormValidators";

//component that renders a form used to post to the server requests to move funds to user balance
function TransferFundsForm() {
    //context that manages the execution of the funds transfer
    const { postDeposit, userBalance } = useContext(UserBalanceContext)
    
    //validation function that checks if user has enough funds for the transfer attempted. Must be re-rendered every time the user balance changes
    const fundsValidator = useCallback(() => fundsAreSuficientForWithdraw(userBalance), [userBalance]) 

    const formFields:IFormField[] =[{
        name: 'Funds to Transfer',
        type: 'number',
        value: '',
        validators: [fundsValidator()]
    }]
    
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