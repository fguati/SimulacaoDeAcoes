import Form from "Components/Form";
import IFormField from "Interfaces/IFormField";
import { fieldIsNotEmpty } from "utils/FormValidators";
import useSubmitForm from "utils/BackendAPICommunication/useSubmitForm";
import { BackendRoutes } from "Common/Types";
import useLoginSuccessHandler from "./utils/useLoginSuccessHandler";

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
    
    const backendLoginRoute: BackendRoutes = '/login'

    /**
     * custom hook that creates the function that submits the user info
     * to the backend and handles the response
    */
    const login = useSubmitForm(backendLoginRoute, useLoginSuccessHandler)

    return(
        <>
            <Form fields={fields} onSubmit={login} data-testid='LoginForm'/>

        </>
    )
}

export default LoginPage;