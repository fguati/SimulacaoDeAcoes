import IUser from "Interfaces/IUser"
import castSignUpEventTargetType from "./castFormEventTargetType"
import signUpRequest from "./signUpRequest"
import handleSignUpResponse from "./handleSignUpResponse"
import { NavigateFunction } from "react-router-dom"

const submitSignUp = async (e:React.FormEvent<HTMLFormElement>, navigate: NavigateFunction) =>{
    const target = castSignUpEventTargetType(e)

    const user: IUser = {
        nome: target.Username.value,
        email: target["E-mail"].value,
        senha: target.Password.value
    }

    const response = await signUpRequest(user)
    handleSignUpResponse(response, navigate)
}

export default submitSignUp;