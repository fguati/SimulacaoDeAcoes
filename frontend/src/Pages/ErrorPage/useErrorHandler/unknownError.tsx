import IErrorResponse from "Interfaces/IErrorResponse";

//Object used as default error when no other error type can be identified 
const unknownError: IErrorResponse = {
    code: 500,
    name: 'Internal Server Error',
    message: 'Unknonw server error. Please report it to dev team'
}

export default unknownError