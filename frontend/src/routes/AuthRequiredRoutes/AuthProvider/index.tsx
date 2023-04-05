import useCookies from "react-cookie/cjs/useCookies";
import LoginPage from "Pages/Login";
import { Outlet } from "react-router-dom";

function AuthProvider() {
    const [ cookies ] = useCookies()

    return(
        cookies.authToken ? <Outlet/> : <LoginPage/> 
    )
}

export default AuthProvider