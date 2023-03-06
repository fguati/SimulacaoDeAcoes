import Button from "Components/Button"
import InputField from "Components/InputField"
import FormContainer from "./FormContainer"
import IFormProps from "./IFormProps"

function Form({fields}:IFormProps) {
    let i = 0
    return(
        <FormContainer action="">
            {fields.map(field => {
                i += 1
                return (<InputField key={i}>{field}</InputField>)
            })}
            <Button>Submit</Button>
        </FormContainer>
    )
}

export default Form;