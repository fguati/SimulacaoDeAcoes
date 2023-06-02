import httpServer from "utils/BackendAPICommunication/http/httpServer"
import { fetchFromServer } from "utils/BackendAPICommunication"
import IErrorResponse from "Interfaces/IErrorResponse"
import { AxiosError, AxiosResponse } from "axios"

describe('Test function responsible for making requests to API in the backend server', () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    it('must return a response with the data from the server and following the IServerResponse interface', async () => {
        const requestSpy = jest.spyOn(httpServer, 'request')
        const mockBody = {message: 'all good'}
        const testRoute = '/login'
        const mockOKResponse = {
            data: mockBody,
            status: 200
        }

        requestSpy.mockResolvedValue(mockOKResponse)

        const result = await fetchFromServer(testRoute, 'GET');

        expect(requestSpy).toHaveBeenCalledWith({
            url: testRoute,
            method: 'GET',
        });
        expect(result).toEqual(expect.objectContaining({
            code: mockOKResponse.status,
            body: mockOKResponse.data,
            ok: true
        }));
    })

    it('must return a response with the following the IServerResponse interface and a body that follow the IErrorResponse interface in case of response with status code of error', async () => {
        const requestSpy = jest.spyOn(httpServer, 'request')
        const mockBody: IErrorResponse = {
            message: 'not found',
            code: 404,
            name: 'NotFoundError'
        }
        const testRoute = '/login'
        const mockFailResponse = {
            data: mockBody,
            status: 404
        }

        const mockError = new AxiosError('not found', '404', undefined, undefined, mockFailResponse as AxiosResponse<IErrorResponse>)

        requestSpy.mockRejectedValue(mockError)

        const result = await fetchFromServer(testRoute, 'GET');

        expect(requestSpy).toHaveBeenCalledWith({
            url: testRoute,
            method: 'GET',
        });
        expect(result).toEqual(expect.objectContaining({
            code: mockFailResponse.status,
            body: mockFailResponse.data,
            ok: false
        }));
    })
})