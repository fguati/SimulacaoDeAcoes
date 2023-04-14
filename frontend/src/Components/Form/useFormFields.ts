import { useState } from 'react'
import IFormField from 'Interfaces/IFormField';

//custom hook that creates a state for all the form fields it receives
function useFormFields (fields: IFormField[]) {
    //creates an state with all the list of all form fields received by the hook
    const [currentFieldValues, setCurrentFieldsValues] = useState<IFormField[]>(fields)

    //setter function that changes the value only of the field which name was entered
    const setFieldValue = ({name, type, value}: IFormField) => {
        //copies the current list so it can be changed
        let newList = [...currentFieldValues]

        //finds the index of the field which value we want to change
        let fieldIndex = newList.findIndex(field => field.name === name)

        //if the field was not found, it is then added to the new list
        if(fieldIndex === -1) {
            newList.push({name, value, type})
            fieldIndex = newList.length - 1
        }

        //changes the value of the desired field
        newList[fieldIndex].value = value

        /**sets the state of the list of fields to the new list
         * with the field value set to the desired value
        */
        setCurrentFieldsValues(newList)
    }

    //function that clear the form by setting the values of all fields to empty
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