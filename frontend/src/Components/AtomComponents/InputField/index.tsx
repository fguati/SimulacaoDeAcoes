import Input from "./StyledInput"
import InputFieldContainer from "./InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";
import Label from "Components/AtomComponents/Label";

//Component made of an input and its label
function InputField( {children, name, currentValue, setValue, inputType = 'text'}: IInputFieldProps ) {
    return(
        <InputFieldContainer role={'InputField'}>
            <Label id={name}>{children}</Label>
            <Input 
                value={currentValue} 
                onChange={e => setValue(e)}
                // onBlur={e => validator(e.target.value)}
                type={inputType}
                name={name}
                aria-labelledby={name}
    
            />

        </InputFieldContainer>
    )
}

export default InputField;