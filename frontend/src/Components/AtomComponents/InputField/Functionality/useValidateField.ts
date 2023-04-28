import { SnackbarContext } from 'Common/Contexts/SnackbarContext'
import { useContext } from 'react'
import { FormValidator } from 'utils/FormValidators'

//If an error is found, update an error list with a message
function addErrorMessageToList(message: string | undefined, isError: boolean, errorList: string[]) {
    if(isError) {
        errorList.push(message ? message : '')
    }
}

//Run a list of validators over a value to be validated and creates a list of messages for all validation errors found 
function listValidatorErrors(validators: FormValidator[], valueToBeValidated: string | number){
    const errorList: string[] = []
    
    validators.forEach(validator => {
        //get the validity status and error message by running validator on target value
        const { valid, message } = validator(valueToBeValidated)
        const isError = !valid

        //add any found errors to the list being built
        addErrorMessageToList(message, isError, errorList)
    })

    return errorList
}

//Hook that renders function that validates a field and, in case its value is invalid, calls an error snackbar
function useValidateField() {
    //gets snackbar calling function in case its needed
    const { activateSnackbar } = useContext(SnackbarContext)

    const fieldValidatorFunction = (fieldName:string, fieldCurrentValue: string | number, fieldValidators: FormValidator[]) => {
        // list any validation errors found in the field
        let errorList = listValidatorErrors(fieldValidators, fieldCurrentValue)

        // if list is empty there is no error (error is false)
        let error = Boolean(errorList.length)

        if(error) {
            // dinamically build a custom error message based on the error messages on the error list
            const errorMessage = `Field ${fieldName} has an invalid value. This field ${errorList.join(', ')}.`
            
            //calls error snackbar with custom message
            activateSnackbar(errorMessage, { colorPalette:'failure' })
        }
    
    }

    return fieldValidatorFunction
}           

export default useValidateField
