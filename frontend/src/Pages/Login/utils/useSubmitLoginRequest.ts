import IUser from "Interfaces/IUser";
import castLoginEventTargetType from "./castLoginEventType";
import useHandleLoginResponse from "./handleLoginResponse";
import requestLogin from "./requestLogin";

const useSubmitLoginRequest = () => {
    const loginResponseHandler = useHandleLoginResponse()
    
    
    return async (e:React.FormEvent<HTMLFormElement>) => {
        const target = castLoginEventTargetType(e)
        
        const user: IUser = {
            email: target["E-mail"].value,
            senha: target.Password.value
        }

        const response = await requestLogin(user)
        const handledResponse = await loginResponseHandler(response)
        return handledResponse
    }

}

export default useSubmitLoginRequest