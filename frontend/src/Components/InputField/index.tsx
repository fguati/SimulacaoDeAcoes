import Title from "Components/Title"
import Input from "Components/Input"
import InputFieldContainer from "./InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";

function InputField( {children}: IInputFieldProps ) {
    return(
        <InputFieldContainer>
            <Title>{children}</Title>
            <Input/>

        </InputFieldContainer>
    )
}

export default InputField;