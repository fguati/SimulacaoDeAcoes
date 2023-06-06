import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";

const formFields:IFormField[] =[{
    name: 'Funds to Transfer',
    type: 'number',
    value: ''
}]

const submitTransferFunds = (fields: IFormField[]) => {
    console.log(fields[0].value)
}

function TransferFundsForm() {

    return (
        <Form fields={formFields} onSubmit={submitTransferFunds}/>
    )
}

export default TransferFundsForm