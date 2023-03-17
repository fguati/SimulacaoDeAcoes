import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import { useSubmitSignUp } from "./utils";


function SignUpPage() {
    const submitSignUp = useSubmitSignUp()
    
    const fields:IFormField[] = [
        {name: 'Username', type: 'text', value:''},
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''},
        {name: 'Confirm Password', type: 'password', value:''}

    ] 

    return(
        <PageLayout>
            <Form fields={fields} onSubmit={(e) => submitSignUp(e)}/>

        </PageLayout>
    )
}

export default SignUpPage;