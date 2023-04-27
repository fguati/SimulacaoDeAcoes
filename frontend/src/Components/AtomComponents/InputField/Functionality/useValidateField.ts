import { SnackbarContext } from 'Common/Contexts/SnackbarContext'
import { useContext } from 'react'
import { FormValidator } from 'utils/FormValidators'

function useValidateField() {
    const { activateSnackbar } = useContext(SnackbarContext)

    const validatorFunction = (name:string, value: string | number, validators: FormValidator[]) => {
        let errorList: string[] = []
        let error = false

        validators.forEach(validator => {
            const { valid, message } = validator(value)
            if(!valid) {
                errorList.push(message ? message : '')
                error = true
            }
        })

        if(error) {
            const errorMessage = `Field ${name} has an invalid value. This field ${errorList.join(', ')}.`
            activateSnackbar(errorMessage, { colorPalette:'failure' })
        }
    
    }

    return validatorFunction
}           

export default useValidateField
