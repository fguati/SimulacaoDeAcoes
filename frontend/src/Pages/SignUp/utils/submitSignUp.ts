import IUser from "Interfaces/IUser"
import useSignUpSuccessHandler from "./useSignUpSuccessHandler"
import submitForm from "utils/BackendAPICommunication/submitFormRequestTo"
import addProperties from "utils/BackendAPICommunication/castEventTargetType"
import listOfSignUpValues from "./listOfSignUpValuesType"
import useHandleRequestResponse from "utils/BackendAPICommunication/useHandleRequestResponse"

const useSubmitSignUp = () =>{
    const signUpSuccessHandler = useSignUpSuccessHandler()
    const signUpResponseHandler = useHandleRequestResponse(signUpSuccessHandler)
    const route = '/register'

    return async (e:React.FormEvent<HTMLFormElement>) => {
        const target = addProperties<listOfSignUpValues>().toTarget(e.target)
    
        const user: IUser = {
            nome: target.Username.value,
            email: target["E-mail"].value,
            senha: target.Password.value
        }
    
        const response = await submitForm<IUser>(user).to(route)
        const handledResponse = await signUpResponseHandler(response)
        return handledResponse
    }
}

export default useSubmitSignUp;