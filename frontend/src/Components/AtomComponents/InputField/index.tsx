import Input from "./StyledComponents/StyledInput"
import InputFieldContainer from "./StyledComponents/InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";
import Label from "Components/AtomComponents/Label";
import useValidateField from "./Functionality/useValidateField";

//Component made of an input and its label
function InputField( {children, name, currentValue, setValue, inputType = 'text', validators = [] }: IInputFieldProps ) {
    //Renders the function responsible for running the field validator functions on its value
    const validateField = useValidateField()
    
    //Function the handles the blur event, calling the field validation function when the focus is changed to another field
    function handleBlur(event: React.FocusEvent<HTMLInputElement, Element>) {
        //Branch that checks if the focus changed to another input field before running the validation
        if(event.relatedTarget?.tagName.toLocaleLowerCase() === 'input'){
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