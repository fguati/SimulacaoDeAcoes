import { RouteObject } from "react-router-dom";
import LoginPage from "Pages/Login";

const rootRoute: RouteObject = {
    path: '/',
    element: <LoginPage />
}

export default rootRoute