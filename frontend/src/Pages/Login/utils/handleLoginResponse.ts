import { useNavigate } from "react-router-dom";
import handleErrorResponse from "utils/handleErrorResponse";

function useHandleLoginResponse() {
    const navigation = useNavigate()
    return async (response: Response) => {
        if(response.status > 399) {
            const handleError = await handleErrorResponse(response, navigation)
            return handleError
        }
        
        return navigation('/')
    }
}

export default useHandleLoginResponse