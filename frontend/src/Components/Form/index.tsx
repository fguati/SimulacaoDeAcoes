import Button from "Components/AtomComponents/Button"
import InputField from "Components/AtomComponents/InputField"
import FormContainer from "./FormContainer"
import IFormProps from "./IFormProps"
import useFormFields from "./useFormFields"
import { formIsValid } from "./validateForm"

/**component for forms. Receives a list of fields, rendered them all as input 
 * fields with the inputs and their labels, and render a submit button as well 
 * that will call the onSubmit functio received as props
*/
function Form({fields, onSubmit, submitButtonText = 'Submit'}:IFormProps) {
    //create a state for the field values of each input field
    const { currentFieldValues, setFieldValue, clearForm } = useFormFields(fields)

    /**wrapper function that gives the basic standard behavior of a form
     * submission. It guarantees that the submission won't reload the
     * page and that after the onSubmit function is called the form is cleared
    */
    const baseOnSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(currentFieldValues)
        clearForm()
    }

    // Validating form
    const formValid = formIsValid(currentFieldValues)
    const submitButtonDisabled = !formValid

    return(
        <FormContainer action="" onSubmit={baseOnSubmit}>
            {currentFieldValues.map((field) => {
                const {name, value, type, validators, selectOptions} = field
                
                return (
                    <InputField 
                        key={name}
                        name={name}
                        currentValue={value}
                        setValue={(e) => setFieldValue({value:e.target.value, name, type})}
                        validators={validators}
                        inputType={type}
                        selectOptions={selectOptions}
                    >
                        {field.name}
                    </InputField>
                )
            })}

            <Button 
                type="submit" 
                disabled={submitButtonDisabled}
                disabledStyle={submitButtonDisabled}
            >
                {submitButtonText}
            </Button>

        </FormContainer>
    )
}

export default Form;