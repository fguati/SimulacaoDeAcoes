import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import useSubmitLoginRequest from "./utils/useSubmitLoginRequest";

/**
 * Renders the Login Page, with email and password input fields and a
 * submit button that post the user info to the backend route /login
 * and then handles the response
 */
function LoginPage() {
    //fields that will be rendered in the login form
    const fields:IFormField[] = [
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''}
    ] 
    
    /**
     * custom hook that creates the function that submits the user info
     * to the backend and handles the response
    */
    const login = useSubmitLoginRequest()

    return(
        <PageLayout>
            <Form fields={fields} onSubmit={login} data-testid='LoginForm'/>

        </PageLayout>
    )
}

export default LoginPage;