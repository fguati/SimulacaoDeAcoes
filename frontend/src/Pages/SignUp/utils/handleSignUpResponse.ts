import { useNavigate } from "react-router-dom";
import handleErrorResponse from "utils/handleErrorResponse";

const useHandleSignUpResponse = () => {
    const navigate = useNavigate()
    return async (response: Response) => {
        if (response.status > 399) {
           const handleError = await handleErrorResponse(response, navigate)
           return handleError
        }
    
        alert('User registered successfully')
    
        return navigate('/login')

    }
}

export default useHandleSignUpResponse;