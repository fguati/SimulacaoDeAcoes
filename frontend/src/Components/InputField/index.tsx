import Input from "Components/Input"
import InputFieldContainer from "./InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";
import Label from "Components/Label";

function InputField( {children, name, currentValue, setValue, inputType = 'text'}: IInputFieldProps ) {
    return(
        <InputFieldContainer role={'InputField'}>
            <Label id={name}>{children}</Label>
            <Input 
                value={currentValue} 
                onChange={e => setValue(e)}
                type={inputType}
                name={name}
                aria-labelledby={name}
    
            />

        </InputFieldContainer>
    )
}

export default InputField;