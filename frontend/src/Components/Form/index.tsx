import Button from "Components/Button"
import InputField from "Components/InputField"
import IFormField from "Interfaces/IFormField"
import { useState } from "react"
import FormContainer from "./FormContainer"
import IFormProps from "./IFormProps"

function Form({fields, onSubmit}:IFormProps) {
    const [currentFieldValues, setCurrentFieldsValues] = useState<IFormField[]>(fields)

    const setFieldValue = ({name, type, value}: IFormField) => {
        let newList = [...currentFieldValues]
        let fieldIndex = newList.findIndex(field => field.name === name)

        if(fieldIndex === -1) {
            newList.push({name, value, type})
        }

        newList[fieldIndex].value = value

        setCurrentFieldsValues(newList)
    }

    const baseOnSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(e)
        clearForm()
    }

    const clearForm = () => {
        const clearedFields = currentFieldValues.map(field => {
            field.value=''
            return field
        })

        setCurrentFieldsValues(clearedFields)
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