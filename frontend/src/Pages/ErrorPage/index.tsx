/* eslint-disable jsx-a11y/aria-role */
import PageLayout from "Components/PageLayout";
import Title from "Components/AtomComponents/Title";
import useErrorHandler from "./useErrorHandler";
import IErrorPageProps from "./IErrorPageProps";

/**
 * render an error page, generated from an error response to a http request. It displays
 * the status code of the response, as well as the status code text and the error message
 */
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