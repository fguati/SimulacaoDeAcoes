import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import useSubmitLoginRequest from "./utils/useSubmitLoginRequest";


function LoginPage() {
    const fields:IFormField[] = [
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''}
    ] 
    
    return(
        <PageLayout>
            <Form fields={fields} onSubmit={useSubmitLoginRequest}/>

        </PageLayout>
    )
}

export default LoginPage;