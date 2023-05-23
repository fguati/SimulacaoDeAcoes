import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import IServerResponse from "Interfaces/IServerResponse";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Function that handles success responses from http requests
 * to the backend API
 */
const useSignUpSuccessHandler = () => {
    const navigate = useNavigate()
    const { activateSnackbar } = useContext(SnackbarContext)
    async function signUpSuccessHandler(response:IServerResponse<unknown>) {
        //rendering snackbar to give success message
        activateSnackbar('User registered successfully', {colorPalette: 'success'})

        return navigate!('/login')
    }
    

    return signUpSuccessHandler
    
}

export default useSignUpSuccessHandler;