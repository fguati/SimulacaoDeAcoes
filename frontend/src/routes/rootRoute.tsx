import { RouteObject } from "react-router-dom";
import loginRoute from './loginRoute';
import signUpRoute from './signUpRoute';
import ErrorPage from "Pages/ErrorPage";
import HomePage from "Pages/HomePage";
import authRequiredRoutes from "./AuthRequiredRoutes";


export const rootIndex: RouteObject = {
    index: true,
    element: <HomePage />
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