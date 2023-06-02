/**
 * interface that determines which properties a response to a http request
 * with a failed status must have. Used to interact with backend API
*/
interface IErrorResponse {
    aditionalInfo?: string
    code: number
    name: string
    message: string
    
}

export default IErrorResponse