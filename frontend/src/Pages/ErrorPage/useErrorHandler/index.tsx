import { useLocation, useRouteError } from "react-router-dom";
import IErrorResponse from "Interfaces/IErrorResponse";
import handleRouteError from "./handleRouteError";
import unknownError from "./unknownError";
import IErrorPageProps from "../IErrorPageProps";

/**
 * this function adapt an Error Response to the proper props interface to be
 * used in the rendering of an error page
 */
function parseErrorResponse(errorResponse: IErrorResponse): IErrorPageProps {
    let {code, name, message, aditionalInfo} = errorResponse
    
    if (aditionalInfo) {
        message = `${message}. Additional info: ${aditionalInfo}`
    }

    return {code, name, message}
}

/**
 * This function checks all the possible sources where the error info may be 
 * sent and uses the error info to create the props needed to render an error
 * page
 */
function useErrorHandler(errorData?: IErrorResponse): IErrorPageProps {
    //Try to get error info sent when the app redirect the user to the error page
    const stateSentInNav = useLocation().state
    //Try ti get error thrown during routing
    const routeError = useRouteError()

    //if error data was entered as an argument, create the error page props from it
    if(errorData?.code) {
        return parseErrorResponse(errorData)
    }

    //if error was caused by a routing error, create the error page props from its info
    if(routeError) {
        return handleRouteError(routeError) 
    }

    //if error was sent during redirecting to error page, create the error page props from its info
    if(stateSentInNav) {
        const parsedState = JSON.parse(stateSentInNav)
        const errorSentInNav = parsedState as IErrorResponse
        return parseErrorResponse(errorSentInNav)
    }
    
    //if error info was not sent any other way, returns the default status 500 unknown internal server error 
    return unknownError
}

export default useErrorHandler;