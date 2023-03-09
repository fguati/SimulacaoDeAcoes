import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import { useNavigate } from "react-router-dom";
import { submitSignUp } from "./utils";


function SignUpPage() {
    const navigate = useNavigate()
    
    const fields:IFormField[] = [
        {name: 'Username', type: 'text', value:''},
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''},
        {name: 'Confirm Password', type: 'password', value:''}

    ] 

    return(
        <PageLayout>
            <Form fields={fields} onSubmit={(e) => submitSignUp(e, navigate)}/>

        </PageLayout>
    )
}

export default SignUpPage;