import IErrorResponse from "Interfaces/IErrorResponse";

const unknownError: IErrorResponse = {
    code: 500,
    name: 'Internal Server Error',
    message: 'Unknonw server error. Please report it to dev team'
}

export default unknownError