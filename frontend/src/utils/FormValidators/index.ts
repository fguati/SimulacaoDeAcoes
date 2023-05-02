import { fieldIsNotEmpty, entederedValueIsWithinLength } from "./globalValidators"
import { emailFieldIsCorrectlyFormatted, passwordMatchesRequirements, passwordFieldMatchesConfirmePassword} from './registerFormValidators'

//Validator types and interfaces
export interface IValidatorReturn {
    message?: string
    valid: boolean
}

export type FormValidator = (value: string | number) => IValidatorReturn

//Export Validators
export {
    fieldIsNotEmpty,
    emailFieldIsCorrectlyFormatted,
    entederedValueIsWithinLength,
    passwordMatchesRequirements,
    passwordFieldMatchesConfirmePassword
}
