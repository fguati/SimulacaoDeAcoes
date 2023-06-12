
//Validator types and interfaces
export interface IValidatorReturn {
    message?: string
    valid: boolean
}

export type FormValidator = (value: string | number) => IValidatorReturn

//Export Validators
export * from "./globalValidators"
export * from './registerFormValidators'
export * from './transferFundsValidators'

