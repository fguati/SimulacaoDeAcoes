import IUser from "Interfaces/IUser";
import { postForm, useHandleRequestResponse, addProperties } from "utils/BackendAPICommunication/";
import useLoginSuccessHandler from "./useLoginSuccessHandler";
import listOfLoginFormValues from "./listOfLoginFormValuesType";

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
    
    return async (e:React.FormEvent<HTMLFormElement>) => {
        //cast event target to a type that can have its properties accessed by typescript
        const target = addProperties<listOfLoginFormValues>().toTarget(e.target)
        
        //use target data to create user to be submited to backend API
        const user: IUser = {
            email: target["E-mail"].value,
            password: target.Password.value
        }

        //make the http request
        const response = await postForm<IUser>(user).to(route)

        //handle response received
        const handledResponse = await loginResponseHandler(response)
        return handledResponse
    }

}

export default useSubmitLoginRequest