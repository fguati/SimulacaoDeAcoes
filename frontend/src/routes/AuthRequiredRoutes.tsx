import useCookies from "react-cookie/cjs/useCookies";
import LoginPage from "Pages/Login";
import { Outlet } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import { rootIndex } from "./rootRoute";


function AuthProvider() {
    const [cookies, setCookie] = useCookies()

    return(
        cookies.authToken ? <Outlet/> : <LoginPage/> 
    )
}

const authRequiredRoutes: RouteObject = {
    element: <AuthProvider/>,
    children: [
        rootIndex
    ]
}

export default authRequiredRoutes