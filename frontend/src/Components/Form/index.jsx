import Button from "Components/Button"
import InputField from "Components/InputField"
import styled from "styled-components";

const FormContainer = styled.form`
    padding: 8px;
`

function Form({fields}) {
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