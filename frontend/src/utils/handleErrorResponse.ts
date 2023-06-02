import IErrorResponse from "Interfaces/IErrorResponse";
import { NavigateFunction } from "react-router-dom";

//Function responsible for handling any error response receive from http requests
async function handleErrorResponse(response: IErrorResponse, navigate: NavigateFunction) {
	//renders an error page with the info received in the response
    return navigate('/error', {state: JSON.stringify(response)})
}

export default handleErrorResponse;