import { Outlet, RouteObject } from "react-router-dom";
import loginRoute from './loginRoute';
import signUpRoute from './signUpRoute';
import ErrorPage from "Pages/ErrorPage";
import HomePage from "Pages/HomePage";
import useCookies from "react-cookie/cjs/useCookies";
import LoginPage from "Pages/Login";
import { useEffect } from "react";

function AuthProvider() {
    const [cookies, setCookie] = useCookies()

    return(
        cookies.authToken ? <Outlet/> : <LoginPage/> 
    )
}

const rootIndex: RouteObject = {
    index: true,
    element: <HomePage />
}

const authRequiredRoutes: RouteObject = {
    element: <AuthProvider/>,
    children: [
        rootIndex
    ]
}

const rootRoute: RouteObject = {
    path: '/',
    errorElement:<ErrorPage/>,
    children:[
        authRequiredRoutes,
        loginRoute,
        signUpRoute
    ]
}

export default rootRoute