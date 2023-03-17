import IErrorResponse from "Interfaces/IErrorResponse";


function parseErrorResponse(errorResponse: IErrorResponse): IErrorPageProps {
    let {code, name, message, aditionalInfo} = errorResponse
    
    if (aditionalInfo) {
        message = `${message}. Additional info: ${aditionalInfo}`
    }

    return {code, name, message}
}

export default parseErrorResponse