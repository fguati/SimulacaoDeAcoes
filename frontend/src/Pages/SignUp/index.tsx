import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import useSubmitSignUp from "./utils/useSubmitSignUp";
import { fieldIsNotEmpty, entederedValueIsWithinLength, emailFieldIsCorrectlyFormatted } from "utils/FormValidators";

function SignUpPage() {
    //Hook that returns function responsible for handling the submission of the register form
    const submitSignUp = useSubmitSignUp()
    
    //input fields present in the register user form
    const fields:IFormField[] = [
        {name: 'Username', type: 'text', value:'', validators: [fieldIsNotEmpty, entederedValueIsWithinLength({minLength: 3})]},
        {name: 'E-mail', type:'email', value:'', validators: [fieldIsNotEmpty, emailFieldIsCorrectlyFormatted]}, 
        {name: 'Password', type:'password', value:''},
        {name: 'Confirm Password', type: 'password', value:''}

    ] 

    return(
        <>
            <Form fields={fields} onSubmit={(e) => submitSignUp(e)}/>

        </>
    )
}

export default SignUpPage;