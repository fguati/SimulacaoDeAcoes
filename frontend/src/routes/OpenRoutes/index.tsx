import signUpRoute from "./signUpRoute";
import loginRoute from "./loginRoute";
import { RouteObject } from "react-router-dom";

const openRoutes: RouteObject = {
    children: [
        signUpRoute,
        loginRoute
    ]
}

export default openRoutes