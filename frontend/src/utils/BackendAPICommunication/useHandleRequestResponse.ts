import { NavigateFunction, useNavigate } from "react-router-dom";
import handleErrorResponse from "./handleErrorResponse";

const useHandleRequestResponse = (happyResponseHandler: (happyResponse: Response, navigateFunction: NavigateFunction) => unknown) => {
    const navigate = useNavigate()
    return async (response: Response) => {
        if (response.status > 399) {
           const handleError = await handleErrorResponse(response, navigate)
           return handleError
        }
    
        return happyResponseHandler(response, navigate)

    }
}

export default useHandleRequestResponse;