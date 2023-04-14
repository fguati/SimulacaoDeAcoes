import IErrorPageProps from "Pages/ErrorPage/IErrorPageProps"

/**
 * interface that determines which properties a response to a http request
 * with a failed status must have. Used to interact with backend API
*/
interface IErrorResponse extends IErrorPageProps {
    aditionalInfo?: string
}

export default IErrorResponse