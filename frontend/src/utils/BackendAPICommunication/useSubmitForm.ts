import { BackendRoutes } from "Common/Types";
import IFormField from "Interfaces/IFormField";
import IServerResponse from "Interfaces/IServerResponse";
import { useHandleRequestResponse, turnFieldListInObject } from "utils/BackendAPICommunication/"
import fetchFromServer from "./http/httpServerFetch";

function useSubmitForm<objToPostType extends object>(route:BackendRoutes, useSuccessHandler: ()=> (response:IServerResponse<unknown>) => Promise<void>) {
    //create a success handler
    const successHandler = useSuccessHandler()
    
    //create a response handler function that receives a success handler for the happy path
    const responseHandler = useHandleRequestResponse<objToPostType>(successHandler)

    return async (formFields: IFormField[]) => {
        //create obejct from form fields to be posted
        const objectToPost = turnFieldListInObject<objToPostType>(formFields)

        //post data to backend API
        const response = await fetchFromServer(route, 'POST', objectToPost)

        //Uses the response handler with the response received form the backend API
        const handledResponse = await responseHandler(response)
        return handledResponse
    }
}

export default useSubmitForm