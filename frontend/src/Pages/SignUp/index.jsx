import Form from "Components/Form";

function SignUpPage() {
    const fields = ['Login', 'Password', 'Confirm Password'] 
    return(
        <main>
            <Form fields={fields} />

        </main>
    )
}

export default SignUpPage;