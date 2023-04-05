import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext } from "react";
import { NavigateFunction, useLocation } from "react-router-dom";

function useLoginSuccessHandler() {
    const location = useLocation()
    const { setLogIn } = useContext(SessionContext)

    function loginSuccessHandler(response: Response, navigation: NavigateFunction) {
        alert('Login feito com suscesso')

        setLogIn!(true)

        if(location.pathname === '/login') {
            return navigation('/')
        }

        return navigation(0)
    }

    return loginSuccessHandler
    
}

export default useLoginSuccessHandler