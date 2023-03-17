import { NavigateFunction } from "react-router-dom";
import handleErrorResponse from "utils/handleErrorResponse";

const handleSignUpResponse = async (response: Response, navigate:NavigateFunction) => {
    console.log('entrou')
    if (response.status > 399) {
       const handleError = await handleErrorResponse(response, navigate)
       return handleError
    }

    alert('User registered successfully')

    return navigate('/login')
}

export default handleSignUpResponse;