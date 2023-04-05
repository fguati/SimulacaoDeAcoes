
import { RouteObject } from "react-router-dom";
import loggedRoot from "./loggedRoot";
import AuthProvider from "./AuthProvider";

const authRequiredRoutes: RouteObject = {
    element: <AuthProvider/>,
    children: [
        loggedRoot
    ]
}

export default authRequiredRoutes