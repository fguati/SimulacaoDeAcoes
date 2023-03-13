import { useLocation, useRouteError } from "react-router-dom";
import IErrorResponse from "Interfaces/IErrorResponse";
import handleRouteError from "./handleRouteError";
import handleErrorResponse from "./handleErrorResponse";
import unknownError from "./unknownError";


function useErrorHandler(errorPageProps?: IErrorResponse) {
    const stateSentInNav = useLocation().state
    const parsedState = JSON.parse(stateSentInNav)
    const errorSentInNav = parsedState as IErrorResponse
    
    const routeError = useRouteError()

    console.log(errorSentInNav, Boolean(errorSentInNav))

    if(errorPageProps?.code) {
        return handleErrorResponse(errorPageProps)
    }

    if(routeError) {
        return handleRouteError(routeError) 
    }

    if(errorSentInNav) {
        return handleErrorResponse(errorSentInNav)
    }
    
    return unknownError
}

export default useErrorHandler;