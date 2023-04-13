import ErrorPage from "Pages/ErrorPage";
import IErrorPageProps from "Pages/ErrorPage/IErrorPageProps";
import { RouteObject } from "react-router-dom";

const notFoundProps: IErrorPageProps = {
    code:404,
    name: 'Page not found',
    message: 'The page you are looking for was not found. Please check if your URL is typed correctly'
}

const notFoundRoute: RouteObject = {
    path: '*',
    element: <ErrorPage {...notFoundProps}/>,
}

export default notFoundRoute