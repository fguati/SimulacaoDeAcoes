import ErrorPage from "Pages/ErrorPage";
import { RouteObject } from "react-router-dom";

const notFoundProps: IErrorPageProps = {
    errorCode:404,
    errorName: 'Page not found',
    errorMessage: 'The page you are looking for was not found. Please check if your URL is typed correctly'
}

const notFoundRoute: RouteObject = {
    path: '*',
    element: <ErrorPage {...notFoundProps}/>,
}

export default notFoundRoute