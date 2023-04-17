import IErrorResponse from "Interfaces/IErrorResponse";
import { NavigateFunction } from "react-router-dom";

//Function responsible for handling any error response receive from http requests
async function handleErrorResponse(response: Response, navigate: NavigateFunction) {
    /**
        * uses the data received from the response to create an error response that matches 
        * the interface of an error response that we established 
    */
    let errorResponse: IErrorResponse = await response.json() as IErrorResponse
    //sets the code property of the error response to be the same as the status code of the response received
	errorResponse.code = response.status
	//renders an error page with the info received in the response
    return navigate('/error', {state: JSON.stringify(errorResponse)})
}

export default handleErrorResponse;