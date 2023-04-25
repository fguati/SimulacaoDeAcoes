import IErrorResponse from "Interfaces/IErrorResponse";
import { NavigateFunction } from "react-router-dom";

/**
 * Function that uses the received response to create an object that implements the IErrorResponse interface
*/
async function getErrorResponseObject (response: Response | IErrorResponse): Promise<IErrorResponse> {
    if(response instanceof Response) {
        const errorResponse = await response.json() as IErrorResponse
        //sets the code property of the error response to be the same as the status code of the response received
        errorResponse.code = response.status
        return errorResponse
    }
    
    return response

}

//Function responsible for handling any error response receive from http requests
async function handleErrorResponse(response: Response | IErrorResponse, navigate: NavigateFunction) {
    const errorResponse = await getErrorResponseObject(response) 
    
	//renders an error page with the info received in the response
    return navigate('/error', {state: JSON.stringify(errorResponse)})
}

export default handleErrorResponse;