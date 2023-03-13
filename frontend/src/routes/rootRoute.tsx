import { RouteObject } from "react-router-dom";
import LoginPage from "Pages/Login";
import loginRoute from './loginRoute';
import signUpRoute from './signUpRoute';
import ErrorPage from "Pages/ErrorPage";

const rootIndex: RouteObject = {
    index: true,
    element: <LoginPage />
}

const rootRoute: RouteObject = {
    path: '/',
    errorElement:<ErrorPage/>,
    children:[
        rootIndex,
        loginRoute,
        signUpRoute
    ]
}

export default rootRoute