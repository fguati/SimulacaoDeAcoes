import IErrorResponse from "Interfaces/IErrorResponse"
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"
import httpStatus from "http-status"; 

//function that take an error thrown and create an Error Response that implements the IErrorResponse interface
function transformErrorInResponse(error: Error, statusCode?: number, message?: string): IErrorResponse {
    //set the unknown error as the default in case no other info is available
    let errorResponse = unknownError

    //takes the message of the error thrown as the default message
    if(error.message){
        errorResponse.message = error.message
    }
    //if the dev enters a status code when calling this function, it uses the status code and its name
    if(statusCode){
        errorResponse.code = statusCode
        errorResponse.name = httpStatus[statusCode]!
    }
    //uses the message parameter if it is entered as an argument
    if(message){
        errorResponse.message = message
    }

    return errorResponse

}

export default transformErrorInResponse
