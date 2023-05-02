import { FormValidator, IValidatorReturn } from "."

/** ------------------------------------Validator that checks if field is empty------------------------------------ */
export const fieldIsNotEmpty: FormValidator = (value) => {
    const res:IValidatorReturn = {
        valid: Boolean(value)
    }

    if(!res.valid) {
        res.message = "can't be empty"
    }

    return res
} 

/** -------------------------------------Validator for length of string inputs------------------------------------- */

interface LengthRangeArg {
    minLength?: number
    maxLength?: number
}

//Function that creates an validation error message for length validation
function buildInvalidLengthMessage ({ minLength = 0, maxLength }: LengthRangeArg):string {
    const baseMessage = 'must have '
    const minLengthMessageFragment = ` at least ${minLength} characters`
    const maxLengthMessageFragment = maxLength ? ` and at most ${maxLength} characters` : ''
    let message = baseMessage + minLengthMessageFragment + maxLengthMessageFragment

    return message
}

//Function that receives the desired length range and uses it to return the length validator
export const entederedValueIsWithinLength = ({ minLength = 0, maxLength }: LengthRangeArg):FormValidator => {
    //Length validator
    return (enteredValue) => {
        const res: IValidatorReturn = {
            valid: true
        }

        //converts entered value to string since validators can receive numbers as arguments
        const valueLength = enteredValue.toString().length

        //Checks if string length is within desired range
        const valueIsBelowMinimun = valueLength < minLength
        const valueIsAboveMaximun = (maxLength && valueLength > maxLength)

        if(valueIsBelowMinimun || valueIsAboveMaximun){
            res.valid = false
            res.message = buildInvalidLengthMessage({ minLength, maxLength })
        }

        return res
    }
}