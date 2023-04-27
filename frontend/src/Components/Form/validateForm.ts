import IFormField from "Interfaces/IFormField";
import { FormValidator } from "utils/FormValidators";

// function validateField(event: React.FocusEvent<HTMLInputElement, Element>): {

// }

//Tests if a validator failed
const isThisValidatorInvalid = (validator: FormValidator, value: string | number):boolean => {
    const { valid } = validator(value)
    const invalid = !valid
    return invalid
}

//Validates a field
const isThisFieldValid = (field: IFormField) => {
    if(field.validators && field.validators.length){
        const oneValidatorIsInvalid = field.validators.some(validator => {
            return isThisValidatorInvalid(validator, field.value)
        })

        const thisFieldIsValid = !oneValidatorIsInvalid
        return thisFieldIsValid
    }
    
    //Fields that don't have validators are always valid
    return true
}

//Validates a whole form
export const formIsValid = (fields: IFormField[]): boolean => {
    const oneFieldIsInvalid = fields.some(field => {
        const thisFieldIsInvalid = !isThisFieldValid(field)
        return thisFieldIsInvalid
    })

    const formValid = !oneFieldIsInvalid

    return formValid
}
