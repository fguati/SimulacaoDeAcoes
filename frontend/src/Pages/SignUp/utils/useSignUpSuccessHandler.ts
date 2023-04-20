import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Function that handles success responses from http requests
 * to the backend API
 */
const useSignUpSuccessHandler = () => {
    const navigate = useNavigate()
    const { activateSnackbar } = useContext(SnackbarContext)
    async function signUpSuccessHandler(response:Response) {
        //rendering snackbar to give success message
        activateSnackbar('User registered successfully', {colorPalette: 'success'})

        return navigate!('/login')
    }
    

    return signUpSuccessHandler
    
}

export default useSignUpSuccessHandler;