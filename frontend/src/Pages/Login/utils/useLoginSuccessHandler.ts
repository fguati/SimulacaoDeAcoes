import { NavigateFunction, useLocation } from "react-router-dom";

function useLoginSuccessHandler() {
    const location = useLocation()

    function loginSuccessHandler(response: Response, navigation: NavigateFunction) {
        alert('Login feito com suscesso')
        
        if(location.pathname === '/login') {
            return navigation('/')
        }

        return navigation(0)
    }

    return loginSuccessHandler
    
}

export default useLoginSuccessHandler