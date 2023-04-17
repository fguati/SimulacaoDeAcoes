import ErrorPage from "Pages/ErrorPage";
import { RouteObject } from "react-router-dom";

/**
 * route used to return error page when the error is 
 * one already foreseen in the code and comes up in the 
 * execution of other functions or methods
*/
const errorRoute: RouteObject = {
    path:'/error',
    element:<ErrorPage/>
}

export default errorRoute