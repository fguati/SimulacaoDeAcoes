import { FormValidator, IValidatorReturn } from "."

//Checks whether email field has a value that is in the email formatting
export const emailFieldIsCorrectlyFormatted: FormValidator = (enteredEmail) => {
    //regex pattern that guarantees entered email has the format email@domain.ccc
    // eslint-disable-next-line no-useless-escape
    const regexEmailTester = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    //convert entered value to string, since the FormValidator interface can receive numbers as arguments
    const emailString = enteredEmail.toString()

    //test if entered email fits determined pattern
    let validEmail = regexEmailTester.test(emailString)
    
    const res: IValidatorReturn = {
        valid: validEmail
    }

    if(!validEmail){
        res.message = 'must have an email with a valid format (ex.: email@domain.com)'
    }

    return res
}

//Checks wheter password meets the format criteria desired
export const passwordMatchesRequirements:FormValidator = (password) => {
    //regex pattern that checks string for the desired format: at least one uppercase, one lowercase and one special character
    const regexPasswordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[!, @, #, $, %, &, *, +, ?])/

    //converts entered value to string since validators can receive numbers as arguments
    const passwordString = password.toString()

    //checks if matches pattern
    const validPassword = regexPasswordPattern.test(passwordString)

    //initialize return value with valid having the value of the check
    const res: IValidatorReturn = {
        valid: validPassword
    }

    //check for failed validation
    if(!validPassword) {
        //load error message on return value
        res.message = 'must have at least one uppercase letter, one lowercase letter and onde special character (!, @, #, $, %, &, *, + or ?)'
    }

    return res
}

//Checks whether password and confirm password fields have the same value
export const passwordFieldMatchesConfirmePassword: FormValidator = (confirmPasswordValue) => {
    //get value from password field (hack: must be done via query selector due to field state no being available at form level)
    const $passwordField = document.querySelector('[aria-labelledby="Password"]') as HTMLInputElement;
    const passwordValue = $passwordField.value

    //check if password and confirm password values match
    const validConfirmPassword = (confirmPasswordValue === passwordValue)

    //initialize return value object
    const res: IValidatorReturn = {
        valid: validConfirmPassword
    }
    //check for failed validation
    if(!validConfirmPassword){
        //load error message on return value
        res.message = 'must have the same value as the Password field'
    }

    return res
}

