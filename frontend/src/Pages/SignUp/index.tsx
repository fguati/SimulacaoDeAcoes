import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { fieldIsNotEmpty, entederedValueIsWithinLength, emailFieldIsCorrectlyFormatted, passwordMatchesRequirements, passwordFieldMatchesConfirmePassword } from "utils/FormValidators";
import useSubmitForm from "utils/BackendAPICommunication/useSubmitForm";
import { BackendRoutes } from "Common/Types";
import useSignUpSuccessHandler from "./utils/useSignUpSuccessHandler";

function SignUpPage() {
    const backendAPISignUpRoute:BackendRoutes = '/register'
    
    //Hook that returns function responsible for handling the submission of the register form
    const submitSignUp = useSubmitForm(backendAPISignUpRoute, useSignUpSuccessHandler)
    
    //input fields present in the register user form
    const fields:IFormField[] = [
        {name: 'Username', type: 'text', value:'', fieldProperty: 'username', validators: [fieldIsNotEmpty, entederedValueIsWithinLength({minLength: 3})]},
        {name: 'E-mail', type:'email', value:'', fieldProperty: 'email', validators: [emailFieldIsCorrectlyFormatted]}, 
        {name: 'Password', type:'password', value:'', fieldProperty: 'password', validators: [passwordMatchesRequirements, entederedValueIsWithinLength({minLength: 8, maxLength: 30})]},
        {name: 'Confirm Password', type: 'password', value:'', validators: [passwordFieldMatchesConfirmePassword]}

    ] 

    return(
        <>
            <Form fields={fields} onSubmit={submitSignUp}/>

        </>
    )
}

export default SignUpPage;