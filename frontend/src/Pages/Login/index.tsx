import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";

function LoginPage() {
    const fields:IFormField[] = [
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''}
    ] 
    
    const submitLoginRequest = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    
    return(
        <PageLayout>
            <Form fields={fields} onSubmit={submitLoginRequest}/>

        </PageLayout>
    )
}

export default LoginPage;