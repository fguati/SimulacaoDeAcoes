import { UserAssetContext } from "Common/Contexts/UserBalanceContext";
import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { useCallback, useContext, useEffect, useRef } from 'react'
import { fundsAreSuficientForWithdraw } from "utils/FormValidators";

//component that renders a form used to post to the server requests to move funds to user balance
function TransferFundsForm() {
    //context that manages the execution of the funds transfer
    const { postDeposit, userBalance } = useContext(UserAssetContext)
    
    //validation function that checks if user has enough funds for the transfer attempted. Must be re-rendered every time the user balance changes
    const fundsValidator = useCallback((value: string | number) => fundsAreSuficientForWithdraw(userBalance)(value), [userBalance]) 

    //Initial value of form fileds
    const formFields:IFormField[] =[{
        name: 'Funds to Transfer',
        type: 'number',
        value: 0,
        validators: [fundsValidator],
        placeholder: 'Quantity to transfer'
    }]

    //reference to the form fields which will allow it to be updated whenever the fundsValidator function is re-rendered
    const formFieldsRef = useRef(formFields)

    //effect that updates the form fields whenever the validator is updated as well
    useEffect(() => {
        const funds2TransferField = formFieldsRef.current.find(field => field.name === 'Funds to Transfer')
        funds2TransferField!.validators = [fundsValidator]
    }, [fundsValidator])
    
    //function that calls the postDeposit function with the data from the form
    const submitTransferFunds = (fields: IFormField[]) => {
        const fundsInputField = fields.find(field => field.name === 'Funds to Transfer')
        const fundsValue = fundsInputField!.value 
        postDeposit(Number(fundsValue))
    }
    
    return (
        <Form fields={formFields} onSubmit={submitTransferFunds} submitButtonText="Transfer"/>
    )
}

export default TransferFundsForm