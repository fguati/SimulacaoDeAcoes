import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import useSubmitLoginRequest from "./utils/useSubmitLoginRequest";
import { fieldIsNotEmpty } from "utils/FormValidators";

/**
 * Renders the Login Page, with email and password input fields and a
 * submit button that post the user info to the backend route /login
 * and then handles the response
 */
function LoginPage() {
    //fields that will be rendered in the login form
    const fields:IFormField[] = [
        {name: 'E-mail', type:'email', value:'', fieldProperty: 'email', validators: [fieldIsNotEmpty]}, 
        {name: 'Password', type:'password', value:'', fieldProperty: 'password', validators: [fieldIsNotEmpty]}
    ] 
    
    /**
     * custom hook that creates the function that submits the user info
     * to the backend and handles the response
    */
    const login = useSubmitLoginRequest()

    return(
        <>
            <Form fields={fields} onSubmit={login} data-testid='LoginForm'/>

        </>
    )
}

export default LoginPage;