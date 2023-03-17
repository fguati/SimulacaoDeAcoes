import IUser from "Interfaces/IUser";
import castLoginEventTargetType from "./castLoginEventType";
import useHandleLoginResponse from "./handleLoginResponse";

const useSubmitLoginRequest = async (e:React.FormEvent<HTMLFormElement>) => {
    const target = castLoginEventTargetType(e)

    const user: IUser = {
        email: target["E-mail"].value,
        senha: target.Password.value
    }

    const loginResponseHandler = useHandleLoginResponse()
    // tentar usar states no form component para substiuir o cast event
    //fazer request
    //rodar handler na resposta

}

export default useSubmitLoginRequest