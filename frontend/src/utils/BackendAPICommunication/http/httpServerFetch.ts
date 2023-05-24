import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import httpServer from "./httpServer"
import { BackendRoutes } from "Common/Types"
import IErrorResponse from "Interfaces/IErrorResponse"
import transformErrorInResponse from "../transformErrorInResponse"
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"
import IServerResponse from 'Interfaces/IServerResponse'

async function fetchFromServer<resDataType>(url: BackendRoutes, method = 'GET', body: resDataType | null = null): Promise<IServerResponse<resDataType | IErrorResponse>> {
    try {
        const config: AxiosRequestConfig = {
            url: url,
            method: method
        }

        if(body) config.data = body

        const axiosResponse : AxiosResponse<resDataType>= await httpServer.request(config)

        const response: IServerResponse<resDataType> = {
            code: axiosResponse.status,
            body: axiosResponse.data,
            ok: true
        }

        return response
        
    } catch (error) {
        const errorResponse: IServerResponse<IErrorResponse> = {
            code: unknownError.code,
            ok: false,
            body: unknownError
        }

        if(error instanceof AxiosError && error.response) {
            console.log()
            const errorData = error.response.data
            const errorResponseBody:IErrorResponse = {
                code: error.response.status,
                message: error.message,
                name: error.name,
            }

            if('code' in errorData) errorResponseBody.code = errorData.code
            if('message' in errorData) errorResponseBody.message = errorData.message
            if('name' in errorData) errorResponseBody.name = errorData.name
            if('aditionalInfo' in errorData) errorResponseBody.aditionalInfo = errorData.aditionalInfo

            errorResponse.body = errorResponseBody
            errorResponse.code = errorResponseBody.code
            return errorResponse
        }

        if(error instanceof Error) {
            const errorResponseBody = transformErrorInResponse(error)
            errorResponse.body = errorResponseBody
            errorResponse.code = errorResponseBody.code
            return errorResponse
        }

        return errorResponse

    }
}

export default fetchFromServer