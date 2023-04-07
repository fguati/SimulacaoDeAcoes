import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import useSubmitLoginRequest from "./utils/useSubmitLoginRequest";


function LoginPage() {
    const fields:IFormField[] = [
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''}
    ] 
    
    const submitLogin = useSubmitLoginRequest()

    return(
        <PageLayout>
            <Form fields={fields} onSubmit={submitLogin} data-testid='LoginForm'/>

        </PageLayout>
    )
}

export default LoginPage;