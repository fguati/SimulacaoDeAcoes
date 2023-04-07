import { RouteObject } from "react-router-dom";
import LoginPage from "Pages/Login";

const loginRoute: RouteObject = {
    path: 'login',
    element: <LoginPage />
}

export default loginRoute