import Form from "Components/Form";
import PageLayout from "Components/PageLayout";

function LoginPage() {
    const fields = ['Login', 'Password'] 
    return(
        <PageLayout>
            <Form fields={fields} />

        </PageLayout>
    )
}

export default LoginPage;