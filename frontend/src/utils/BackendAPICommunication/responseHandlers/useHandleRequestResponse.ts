import { NavigateFunction, useNavigate } from "react-router-dom";
import handleErrorResponse from "../../handleErrorResponse";
import IErrorResponse from "Interfaces/IErrorResponse";
import IServerResponse from "Interfaces/IServerResponse";

/**
 * Custom hook that returns function that act as handler for any response received
 * by http requests. Had to be implemented as a hook because uses other hooks but is
 * called in event listeners
 * It has a function that handles the success cases beacuse so the success can be handled
 * in customized ways, according to the requirements of the module that makes the request
 */
function useHandleRequestResponse<resBodyType extends object> (happyResponseHandler: (happyResponse: IServerResponse<unknown>, navigateFunction: NavigateFunction) => unknown) {
    const navigate = useNavigate()
    return async (response: IServerResponse<resBodyType | IErrorResponse | null>) => {
        //check if response body implements Error response interface
        const bodyIsErrorRes = (response.body &&'code' in response.body && 'message' in response.body && 'name' in response.body)
        //check if response received is an error one and, if it is, calls the error response handler
        if (response.code > 399 && bodyIsErrorRes) {
            const handleError = await handleErrorResponse(response.body as IErrorResponse, navigate)
            return handleError
        }
        
        //if response received is a successfull one, calls the success handler entered as argument
        return happyResponseHandler(response, navigate)

    }
}

export default useHandleRequestResponse;