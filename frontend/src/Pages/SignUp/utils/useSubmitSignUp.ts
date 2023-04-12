import IUser from "Interfaces/IUser"
import { postForm, addProperties, useHandleRequestResponse } from "utils/BackendAPICommunication/"
import useSignUpSuccessHandler from "./useSignUpSuccessHandler"
import listOfSignUpValues from "./listOfSignUpValuesType"

const useSubmitSignUp = () =>{
    const signUpSuccessHandler = useSignUpSuccessHandler()
    const signUpResponseHandler = useHandleRequestResponse(signUpSuccessHandler)
    const route = '/register'

    return async (e:React.FormEvent<HTMLFormElement>) => {
        const target = addProperties<listOfSignUpValues>().toTarget(e.target)
    
        const user: IUser = {
            username: target.Username.value,
            email: target["E-mail"].value,
            password: target.Password.value
        }
    
        const response = await postForm<IUser>(user).to(route)
        const handledResponse = await signUpResponseHandler(response)
        return handledResponse
    }
}

export default useSubmitSignUp;