import { useState } from 'react'
import IFormField from 'Interfaces/IFormField';

function useFormFields (fields: IFormField[]) {
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

    const clearForm = () => {
        const clearedFields = currentFieldValues.map(field => {
            field.value=''
            return field
        })

        setCurrentFieldsValues(clearedFields)
    }

    return { currentFieldValues, setFieldValue, clearForm }
}

export default useFormFields;