import IUser from "Interfaces/IUser"
import { postForm, useHandleRequestResponse } from "utils/BackendAPICommunication/"
import useSignUpSuccessHandler from "./useSignUpSuccessHandler"
import IFormField from "Interfaces/IFormField"
import turnFieldListInObject from "utils/turnFieldListInObject"

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

    return async (listOfFields: IFormField[]) => {
        //create user to be posted from the values of the field list
        const user: IUser = turnFieldListInObject<IUser>(listOfFields) 

        //posts the user data to the backend API
        const response = await postForm<IUser>(user).to(route)
        
        //Uses the response handler with the response received form the backend API
        const handledResponse = await signUpResponseHandler(response)
        return handledResponse
    }
}

export default useSubmitSignUp;