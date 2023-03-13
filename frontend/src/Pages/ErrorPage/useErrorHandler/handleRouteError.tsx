import { isRouteErrorResponse } from "react-router-dom";
import httpStatus from "http-status";
import IErrorResponse from "Interfaces/IErrorResponse";
import unknownError from "./unknownError";

function handleRouteError(routeError: unknown): IErrorResponse {
    let {code, name, message} = unknownError

    if(isRouteErrorResponse(routeError)) {
        code = routeError.status 
        name = httpStatus[routeError.status] as string
        message = routeError.statusText
    }

    if(routeError instanceof Error) {
        code = 500
        name = routeError.name
        message = routeError.message
    }

    if(routeError instanceof Response) {
        code = routeError.status
        name = httpStatus[routeError.status] as string
        message = routeError.statusText
    }

    return {code, name, message}
}

export default handleRouteError