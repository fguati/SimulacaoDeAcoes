import ErrorPage from "Pages/ErrorPage";
import { RouteObject } from "react-router-dom";

const errorRoute: RouteObject = {
    path:'/error',
    element:<ErrorPage/>
}

export default errorRoute