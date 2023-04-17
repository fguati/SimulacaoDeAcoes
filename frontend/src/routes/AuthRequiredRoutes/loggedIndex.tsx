import HomePage from "Pages/HomePage";
import { RouteObject } from "react-router-dom";

//Route to homepage when user is logged in
const loggedIndex: RouteObject = {
    index: true,
    element: <HomePage />
}

export default loggedIndex