import Input from "./StyledComponents/StyledInput"
import InputFieldContainer from "./StyledComponents/InputFieldContainer";
import IInputFieldProps from "./IInputFieldProps";
import Label from "Components/AtomComponents/Label";
import useValidateField from "./Functionality/useValidateField";
import Dropdown from "./StyledComponents/StyledDropdown";
import Option from "./StyledComponents/StyledOption";

//Component made of an input and its label
function InputField( {children, name, currentValue, setValue, inputType = 'text', validators = [], selectOptions = [], placeholder = '' }: IInputFieldProps ) {
    //Renders the function responsible for running the field validator functions on its value
    const validateField = useValidateField()
    
    //Function the handles the blur event, calling the field validation function when the focus is changed to another field
    function handleBlur(event: React.FocusEvent<HTMLInputElement | HTMLSelectElement, Element>) {
        //Branch that checks if the focus changed to another input field before running the validation
        const targetElementTag = event.relatedTarget?.tagName.toLocaleLowerCase()
        if(targetElementTag === 'input' || targetElementTag === 'select'){
            return validateField(name, currentValue, validators)
        }
    }

    return(
        <InputFieldContainer role={'InputField'}>
            <Label id={name}>{children}</Label>
            {inputType !== 'dropdown' ? 
                <Input 
                    value={currentValue} 
                    onChange={e => setValue(e)}
                    onBlur={e => handleBlur(e)}
                    type={inputType}
                    name={name}
                    aria-labelledby={name}
                    placeholder={placeholder}
        
                /> :

                <Dropdown
                    value={currentValue} 
                    onChange={e => setValue(e)}
                    onBlur={e => handleBlur(e)}
                    name={name}
                >
                    <Option value={''} disabled></Option>
                    {selectOptions.map(option => (<Option value={option} key={option}>{option}</Option>))}
                </Dropdown>

            }

        </InputFieldContainer>
    )
}

export default InputField;