import Button from "Components/AtomComponents/Button"
import InputField from "Components/AtomComponents/InputField"
import FormContainer from "./FormContainer"
import IFormProps from "./IFormProps"
import useFormFields from "./useFormFields"

function Form({fields, onSubmit}:IFormProps) {
    const { currentFieldValues, setFieldValue, clearForm } = useFormFields(fields)

    const baseOnSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(e)
        clearForm()
    }

    return(
        <FormContainer action="" onSubmit={baseOnSubmit}>
            {currentFieldValues.map((field) => {
                const {name, value, type} = field
                return (
                    <InputField 
                        key={name}
                        name={name}
                        currentValue={value}
                        setValue={(e) => setFieldValue({value:e.target.value, name, type})}
                        inputType={type}
                    >
                        {field.name}
                    </InputField>
                )
            })}
            <Button type="submit">Submit</Button>
        </FormContainer>
    )
}

export default Form;