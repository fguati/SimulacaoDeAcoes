import {BackendRoutes} from "Common/Types/";
import IErrorResponse from "Interfaces/IErrorResponse";
import serverRequest from "./httpServerFetch";

//Function that post forms to the backend API. It returns an object with the 'to' method so when used it becomes 'postForm(formName).to(route)', which is more readable
function postForm<bodyType>(body:bodyType) {
    return {
        async to(route: BackendRoutes): Promise<Response | IErrorResponse> {
            return await serverRequest(route, 'POST', body)
        }
    }
}

export default postForm;