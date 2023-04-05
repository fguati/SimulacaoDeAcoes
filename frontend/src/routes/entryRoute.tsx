import { RouteObject } from "react-router-dom";
import ErrorPage from "Pages/ErrorPage";
import authRequiredRoutes from "./AuthRequiredRoutes";
import openRoutes from "./OpenRoutes";

const entryRoute: RouteObject = {
    path: '/',
    errorElement:<ErrorPage/>,
    children:[
        authRequiredRoutes,
        openRoutes
    ]
}

export default entryRoute