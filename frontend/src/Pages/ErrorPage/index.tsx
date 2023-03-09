import PageLayout from "Components/PageLayout";
import Title from "Components/Title";

function ErrorPage({errorCode, errorName, errorMessage}:IErrorPageProps) {
    return(
        <PageLayout>
            <Title>{`Error ${errorCode}: ${errorName}`}</Title>
            <p>{errorMessage}</p>
        </PageLayout>
    )
}

export default ErrorPage