import Form from "Components/Form";

function LoginPage() {
    const fields = ['Login', 'Password'] 
    return(
        <main>
            <Form fields={fields} />

        </main>
    )
}

export default LoginPage;