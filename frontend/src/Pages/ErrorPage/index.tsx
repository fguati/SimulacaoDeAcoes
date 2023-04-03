import PageLayout from "Components/PageLayout";
import Title from "Components/AtomComponents/Title";
import useErrorHandler from "./useErrorHandler";

function ErrorPage(props: IErrorPageProps) {
    const {code, name, message} = useErrorHandler(props)

    return(
        <PageLayout>
            <Title role={'title'}>{`Error ${code}: ${name}`}</Title>
            <p role={'message'}>{message}</p>
        </PageLayout>
    )
}

export default ErrorPage