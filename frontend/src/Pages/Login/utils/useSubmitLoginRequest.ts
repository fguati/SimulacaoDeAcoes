import IUser from "Interfaces/IUser";
import { postForm, useHandleRequestResponse, addProperties } from "utils/BackendAPICommunication/";
import useLoginSuccessHandler from "./useLoginSuccessHandler";
import listOfLoginFormValues from "./listOfLoginFormValuesType";

const useSubmitLoginRequest = () => {
    const loginSuccessHandler = useLoginSuccessHandler()
    const loginResponseHandler = useHandleRequestResponse(loginSuccessHandler)
    const route = '/login'
    
    return async (e:React.FormEvent<HTMLFormElement>) => {
        const target = addProperties<listOfLoginFormValues>().toTarget(e.target)
        
        const user: IUser = {
            email: target["E-mail"].value,
            senha: target.Password.value
        }

        const response = await postForm<IUser>(user).to(route)
        const handledResponse = await loginResponseHandler(response)
        return handledResponse
    }

}

export default useSubmitLoginRequest