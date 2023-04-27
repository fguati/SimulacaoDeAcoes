import IFormField from "Interfaces/IFormField";
import { FormValidator } from "utils/FormValidators";

// function validateField(event: React.FocusEvent<HTMLInputElement, Element>): {

// }

const isThisValidatorInvalid = (validator: FormValidator, field: IFormField):boolean => {
    const valid = validator(field)
    const invalid = !valid
    return invalid
}

const isThisFieldInvalid = (field: IFormField) => {
    if(field.validators && field.validators.length){
        const isOneValidatorInvalid = field.validators.some(validator => {
            return isThisValidatorInvalid(validator, field)
        })
        return isOneValidatorInvalid
    }
    
    return false
}

export const isAnyFieldInvalid = (fields: IFormField[]): boolean => {
    const oneFieldIsInvalid = fields.some(field => {
        const thisFieldIsInvalid = isThisFieldInvalid(field)
        return thisFieldIsInvalid
    })

    return oneFieldIsInvalid
}
