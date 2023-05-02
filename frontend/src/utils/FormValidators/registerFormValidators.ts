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

// Password:
// Formato: 8 chars min, num, letra maius, letra min, char especial

// Confirmar Password:
// valor do campo igual ao do campo password