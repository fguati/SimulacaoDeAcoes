import { useLocation, useRouteError } from "react-router-dom";
import IErrorResponse from "Interfaces/IErrorResponse";
import handleRouteError from "./handleRouteError";
import parseErrorResponse from "./parseErrorResponse";
import unknownError from "./unknownError";


function useErrorHandler(errorPageProps?: IErrorResponse) {
    const stateSentInNav = useLocation().state
    const parsedState = JSON.parse(stateSentInNav)
    const errorSentInNav = parsedState as IErrorResponse
    
    const routeError = useRouteError()

    if(errorPageProps?.code) {
        return parseErrorResponse(errorPageProps)
    }

    if(routeError) {
        return handleRouteError(routeError) 
    }

    if(errorSentInNav) {
        return parseErrorResponse(errorSentInNav)
    }
    
    return unknownError
}

export default useErrorHandler;