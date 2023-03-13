import Title from "Components/Title"
import Input from "Components/Input"
import InputFieldContainer from "./InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";

function InputField( {children, name, currentValue, setValue, inputType = 'text'}: IInputFieldProps ) {
    return(
        <InputFieldContainer role={'InputField'}>
            <Title>{children}</Title>
            <Input 
                value={currentValue} 
                onChange={e => setValue(e)}
                type={inputType}
                name={name}
    
            />

        </InputFieldContainer>
    )
}

export default InputField;