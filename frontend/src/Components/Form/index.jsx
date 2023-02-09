import Button from "Components/Button"
import InputField from "Components/InputField"
import styled from "styled-components";

const FormContainer = styled.form`
    padding: 8px;
`

function Form({fields}) {
    return(
        <FormContainer action="">
            {fields.map(field => <InputField>{field}</InputField>)}
            <Button>Submit</Button>
        </FormContainer>
    )
}

export default Form;