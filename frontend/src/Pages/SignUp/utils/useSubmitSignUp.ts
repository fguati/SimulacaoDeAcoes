import IUser from "Interfaces/IUser"
import { postForm, addProperties, useHandleRequestResponse } from "utils/BackendAPICommunication/"
import useSignUpSuccessHandler from "./useSignUpSuccessHandler"
import listOfSignUpValues from "./listOfSignUpValuesType"

/**
 * Custom hook that return function responsible for handling the submission of the
 * register user form. Had to be implemented as a hook because it calls other hooks,
 * but had to return a non-hook function because hooks can't be called in event listeners.
 */
const useSubmitSignUp = () =>{
    //create a response handler function that receives a success handler for the happy path
    const signUpSuccessHandler = useSignUpSuccessHandler()
    const signUpResponseHandler = useHandleRequestResponse(signUpSuccessHandler)

    const route = '/register'

    return async (e:React.FormEvent<HTMLFormElement>) => {
        /**
         * cast the event target type with the properties of the register user
         * form so typescript can access this properties 
         */
        const target = addProperties<listOfSignUpValues>().toTarget(e.target)
        
        //creating user to be submiited with form data
        const user: IUser = {
            username: target.Username.value,
            email: target["E-mail"].value,
            password: target.Password.value
        }
        
        //posts the user data to the backend API
        const response = await postForm<IUser>(user).to(route)
        
        //Uses the response handler with the response received form the backend API
        const handledResponse = await signUpResponseHandler(response)
        return handledResponse
    }
}

export default useSubmitSignUp;