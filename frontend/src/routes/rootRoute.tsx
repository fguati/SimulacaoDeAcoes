import { RouteObject } from "react-router-dom";
import loginRoute from './loginRoute';
import signUpRoute from './signUpRoute';
import ErrorPage from "Pages/ErrorPage";
import authRequiredRoutes from "./AuthRequiredRoutes";




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