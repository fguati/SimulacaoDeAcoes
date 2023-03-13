import IErrorResponse from "Interfaces/IErrorResponse";


function handleErrorResponse(errorResponse: IErrorResponse): IErrorPageProps {
    console.log(errorResponse.code)
    let {code, name, message, aditionalInfo} = errorResponse
    
    if (aditionalInfo) {
        message = `${message}. Additional info: ${aditionalInfo}`
    }

    return {code, name, message}
}

export default handleErrorResponse