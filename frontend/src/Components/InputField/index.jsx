import Title from "Components/Title"
import Input from "Components/Input"
import styled from "styled-components";

const InputFieldContainer = styled.div`
    margin: 8px;
`

function InputField( {children} ) {
    return(
        <InputFieldContainer>
            <Title>{children}</Title>
            <Input/>

        </InputFieldContainer>
    )
}

export default InputField;