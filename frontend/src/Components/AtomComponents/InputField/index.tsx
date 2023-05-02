import Input from "./StyledComponents/StyledInput"
import InputFieldContainer from "./StyledComponents/InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";
import Label from "Components/AtomComponents/Label";
import useValidateField from "./Functionality/useValidateField";

//Component made of an input and its label
function InputField( {children, name, currentValue, setValue, inputType = 'text', validators = [] }: IInputFieldProps ) {
    const validateField = useValidateField()
    
    function handleBlur(event: React.FocusEvent<HTMLInputElement, Element>) {
        if(event.relatedTarget?.tagName){
            return validateField(name, currentValue, validators)
        }
    }

    return(
        <InputFieldContainer role={'InputField'}>
            <Label id={name}>{children}</Label>
            <Input 
                value={currentValue} 
                onChange={e => setValue(e)}
                onBlur={e => handleBlur(e)}
                type={inputType}
                name={name}
                aria-labelledby={name}
    
            />

        </InputFieldContainer>
    )
}

export default InputField;