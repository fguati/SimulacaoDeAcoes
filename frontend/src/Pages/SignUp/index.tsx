import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import IFormField from "Interfaces/IFormField";
import IUser from "Interfaces/IUser";
import { signUpRequest } from "./utils";


function SignUpPage() {
    const fields:IFormField[] = [
        {name: 'Username', type: 'text', value:''},
        {name: 'E-mail', type:'email', value:''}, 
        {name: 'Password', type:'password', value:''},
        {name: 'Confirm Password', type: 'password', value:''}

    ] 

    const onSubmitSignUp = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const target = e.target as typeof e.target & {
            "Username": { value: string };
            "E-mail": { value: string };
            "Password": { value: string };
            "Confirm Password": { value: string };
        };

        const user: IUser = {
            nome: target.Username.value,
            email: target["E-mail"].value,
            senha: target.Password.value
        }

        const response = await signUpRequest(user)

    }

    return(
        <PageLayout>
            <Form fields={fields} onSubmit={onSubmitSignUp}/>

        </PageLayout>
    )
}

export default SignUpPage;