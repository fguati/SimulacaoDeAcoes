import Form from "Components/Form";
import PageLayout from "Components/PageLayout";

function SignUpPage() {
    const fields = ['Login', 'Password', 'Confirm Password'] 
    return(
        <PageLayout>
            <Form fields={fields} />

        </PageLayout>
    )
}

export default SignUpPage;