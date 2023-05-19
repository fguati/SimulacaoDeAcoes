import {backendURL} from "Common/Constants";
import {BackendRoutes} from "Common/Types/";
import transformErrorInResponse from "./transformErrorInResponse";
import IErrorResponse from "Interfaces/IErrorResponse";

//Function that post forms to the backend API. It returns an object with the 'to' method so when used it becomes 'postForm(formName).to(route)', which is more readable
function postForm<bodyType>(body:bodyType) {
    //set the data for the API request, including the form data, already converted to JSON
    const myInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }

    return {
        async to(route: BackendRoutes): Promise<Response | IErrorResponse> {
            //combines backend url with chosen route to get endpoint to which to post the form
            const endpoint = backendURL + route
            try {
                const response = await fetch(endpoint, myInit)
                return response
            } catch (error) {
                //convert error into an error response so it can be used in response handler functions
                const errorResponse = transformErrorInResponse(error as Error)
                return errorResponse
            }

        }
    }
}

export default postForm;