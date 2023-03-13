import { NavigateFunction } from "react-router-dom";
import IErrorResponse from "Interfaces/IErrorResponse";

const handleSignUpResponse = async (response: Response, navigate:NavigateFunction) => {
    const status = response.status
    console.log(status, status > 399)
    
    if (status > 399) {
        let errorResponse: IErrorResponse = await response.json() as IErrorResponse
        errorResponse.code = status
        return navigate('/error', {state: JSON.stringify(errorResponse)})
    }

    alert('User registered successfully')

    return navigate('/login')
}

export default handleSignUpResponse;