import IUser from "Interfaces/IUser";
import { postForm, useHandleRequestResponse } from "utils/BackendAPICommunication/";
import useLoginSuccessHandler from "./useLoginSuccessHandler";
import IFormField from "Interfaces/IFormField";
import turnFieldListInObject from "utils/turnFieldListInObject";

/**
 * Custom hook that returns a function that submits the login form to the backend
 * API /login route.
 * This function had to be created as a submit that returns the actual
 * handler function since only hooks can invoke other hooks but hooks
 * cannot be used on the event handlers
 */
const useSubmitLoginRequest = () => {
    //create a function that handle successful http requests
    const loginSuccessHandler = useLoginSuccessHandler()
    //create function that handles any response
    const loginResponseHandler = useHandleRequestResponse(loginSuccessHandler)
    
    const route = '/login'
    
    return async (fiedlList: IFormField[]) => {
        //create user to be posted from the values of the field list
        const user: IUser = turnFieldListInObject<IUser>(fiedlList) 

        //make the http request
        const response = await postForm<IUser>(user).to(route)

        //handle response received
        const handledResponse = await loginResponseHandler(response)
        return handledResponse
    }

}

export default useSubmitLoginRequest