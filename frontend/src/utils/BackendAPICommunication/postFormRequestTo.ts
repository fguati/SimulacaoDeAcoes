import {backendURL} from "Common/Constants";
import BackendRoutes from "Common/Types/BackendRoutes";

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
        async to(route: BackendRoutes) {
            //combines backend url with chosen route to get endpoint to which to post the form
            const endpoint = backendURL + route
            const response = await fetch(endpoint, myInit)
            return response

        }
    }
}

export default postForm;