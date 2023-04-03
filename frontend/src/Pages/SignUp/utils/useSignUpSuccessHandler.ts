import { useNavigate } from "react-router-dom";


const useSignUpSuccessHandler = () => {
    const navigate = useNavigate()
    async function signUpSuccessHandler(response:Response) {
        alert('User registered successfully')
    
        return navigate!('/login')
    }
    

    return signUpSuccessHandler
    
}

export default useSignUpSuccessHandler;