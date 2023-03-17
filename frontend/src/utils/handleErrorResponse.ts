import IErrorResponse from "Interfaces/IErrorResponse";
import { NavigateFunction } from "react-router-dom";

async function handleErrorResponse(response: Response, navigate: NavigateFunction) {
    let errorResponse: IErrorResponse = await response.json() as IErrorResponse
    errorResponse.code = response.status
    return navigate('/error', {state: JSON.stringify(errorResponse)})
}

export default handleErrorResponse;