
import { RouteObject } from "react-router-dom";
import loggedRoot from "./loggedRoot";
import AuthRequestBranch from "./AuthChecker";

const authRequiredRoutes: RouteObject = {
    element: <AuthRequestBranch/>,
    children: [
        loggedRoot
    ]
}

export default authRequiredRoutes