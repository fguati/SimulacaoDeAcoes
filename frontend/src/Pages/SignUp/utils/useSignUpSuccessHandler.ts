import { useNavigate } from "react-router-dom";

/**
 * Function that handles success responses from http requests
 * to the backend API
 */
const useSignUpSuccessHandler = () => {
    const navigate = useNavigate()
    async function signUpSuccessHandler(response:Response) {
        alert('User registered successfully')
    
        return navigate!('/login')
    }
    

    return signUpSuccessHandler
    
}

export default useSignUpSuccessHandler;