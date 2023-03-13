import PageLayout from "Components/PageLayout";
import Title from "Components/Title";
import useErrorHandler from "./useErrorHandler";

function ErrorPage(props: IErrorPageProps) {
    const {code, name, message} = useErrorHandler(props)

    return(
        <PageLayout>
            <Title>{`Error ${code}: ${name}`}</Title>
            <p>{message}</p>
        </PageLayout>
    )
}

export default ErrorPage