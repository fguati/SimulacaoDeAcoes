import { useLocation, useNavigate } from "react-router-dom";
import handleErrorResponse from "utils/handleErrorResponse";

function useHandleLoginResponse() {
    const location = useLocation()
    const navigation = useNavigate()
    return async (response: Response) => {
        if(response.status > 399) {
            const handleError = await handleErrorResponse(response, navigation)
            return handleError
        }
        
        alert('Login feito com suscesso')
        
        if(location.pathname === '/login') {
            return navigation('/')
        }

        return navigation(0)
    }
}

export default useHandleLoginResponse