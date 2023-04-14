import { isRouteErrorResponse } from "react-router-dom";
import httpStatus from "http-status";
import IErrorResponse from "Interfaces/IErrorResponse";
import unknownError from "./unknownError";

/**
 * Function that receives a route error and returns a response error
 */
function handleRouteError(routeError: unknown): IErrorResponse {
    /**
     * this line is to guarantee that, if the error does not belong to
     * any known type, it will still return a valid error response 
     * with status 500
    */
    let {code, name, message} = unknownError

    /**
     *check if the error received really is a route error and uses
     * its info to create the error response that will be the return value
    */
    if(isRouteErrorResponse(routeError)) {
        code = routeError.status 
        name = httpStatus[routeError.status] as string
        message = routeError.statusText
    }

    /**
     * check if the error received is an instance of a normal Error object
     * and uses its name and message to create the error response that will 
     * be the return value
    */
    if(routeError instanceof Error) {
        name = routeError.name
        message = routeError.message
    }

    /**
     * check if the error received is an instance of a Response object
     * and uses its status and message to create the error response that 
     * will be the return value
    */
    if(routeError instanceof Response) {
        code = routeError.status
        name = httpStatus[routeError.status] as string
        message = routeError.statusText
    }

    return {code, name, message}
}

export default handleRouteError