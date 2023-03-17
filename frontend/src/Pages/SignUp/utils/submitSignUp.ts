import IUser from "Interfaces/IUser"
import castSignUpEventTargetType from "./castFormEventTargetType"
import signUpRequest from "./signUpRequest"
import useHandleSignUpResponse from "./handleSignUpResponse"

const useSubmitSignUp = () =>{
    const signUpResponseHandler = useHandleSignUpResponse()

    return async (e:React.FormEvent<HTMLFormElement>) => {
        const target = castSignUpEventTargetType(e)
    
        const user: IUser = {
            nome: target.Username.value,
            email: target["E-mail"].value,
            senha: target.Password.value
        }
    
        const response = await signUpRequest(user)
        const handledResponse = await signUpResponseHandler(response)
        return handledResponse
    }
}

export default useSubmitSignUp;