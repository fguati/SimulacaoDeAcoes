import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import httpServer from "./httpServer"
import { BackendRoutes } from "Common/Types"
import IErrorResponse from "Interfaces/IErrorResponse"
import transformErrorInResponse from "../responseHandlers/transformErrorInResponse"
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"
import IServerResponse from 'Interfaces/IServerResponse'

/**
 * function make http requests to the backend server and returns a response
 */
async function fetchFromServer<resDataType>(url: BackendRoutes, method = 'GET', body: resDataType | null = null): Promise<IServerResponse<resDataType | IErrorResponse>> {
    try {
        const config: AxiosRequestConfig = setAxiosConfig<resDataType>(url, method, body)

        const axiosResponse : AxiosResponse<resDataType>= await httpServer.request(config)

        return convertAxiosResponse<resDataType>(axiosResponse)
        
    } catch (error) {
        //set standard error response to be retuned in case error dont fit any of the cases below 
        const errorResponse: IServerResponse<IErrorResponse> = {
            code: unknownError.code,
            ok: false,
            body: unknownError
        }

        //handle case where error is an error response
        if(error instanceof AxiosError && error.response) {
            return handleAxiosResponseError(error, errorResponse)
        }

        //handle case where error is an instance of the generic error class
        if(error instanceof Error) {
            return handleGenericError(error, errorResponse)
        }

        return errorResponse

    }
}

function handleGenericError(error: Error, errorResponse: IServerResponse<IErrorResponse>) {
    const errorResponseBody = transformErrorInResponse(error)
    errorResponse.body = errorResponseBody
    errorResponse.code = errorResponseBody.code
    return errorResponse
}

function handleAxiosResponseError(error: AxiosError<any, any>, errorResponse: IServerResponse<IErrorResponse>) {
    const errorData = error.response!.data as IErrorResponse
    const errorResponseBody: IErrorResponse = {
        code: error.response!.status,
        message: error.message,
        name: error.name,
    }
    
    if ('code' in errorData) errorResponseBody.code = errorData.code
    if ('message' in errorData) errorResponseBody.message = errorData.message
    if ('name' in errorData) errorResponseBody.name = errorData.name
    if ('aditionalInfo' in errorData) errorResponseBody.aditionalInfo = errorData.aditionalInfo

    errorResponse.body = errorResponseBody
    errorResponse.code = errorResponseBody.code
    return errorResponse
}

function setAxiosConfig<resDataType>(url: string, method: string, body: resDataType | null) {
    const config: AxiosRequestConfig = {
        url: url,
        method: method
    }

    if (body)
        config.data = body
    return config
}

function convertAxiosResponse<resDataType>(axiosResponse: AxiosResponse<resDataType, any>) {
    const response: IServerResponse<resDataType> = {
        code: axiosResponse.status,
        body: axiosResponse.data,
        ok: true
    }

    return response
}

export default fetchFromServer
