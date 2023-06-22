import { renderHook } from '@testing-library/react-hooks';
import IErrorResponse from 'Interfaces/IErrorResponse';
import IServerResponse from 'Interfaces/IServerResponse';
import { useHandleRequestResponse } from 'utils/BackendAPICommunication';
import handleErrorResponse from 'utils/handleErrorResponse'

jest.mock('react-router-dom', () => ({
  Navigate: () => null,
  useNavigate: () => jest.fn(),
}));

jest.mock('utils/handleErrorResponse', () => {
    return jest.fn()
})

describe('Tests for the useHandleRequestResponse custom hook', () => {
    const mockedErrorHandler = handleErrorResponse as jest.MockedFunction<typeof handleErrorResponse> 
    
    it('calls the happy path handler with response if status code is below 400', async () => {
        const mockResponse: IServerResponse<Object> = {
            code: 200,
            ok: true
        }
        const mockHandler = jest.fn();
        const { result } = renderHook(() => useHandleRequestResponse(mockHandler));
        await result.current(mockResponse);
        expect(mockHandler).toHaveBeenCalledWith(mockResponse, expect.any(Function));
    })

    it('calls handleErrorResponse if status code is above 399', async () => {
        mockedErrorHandler.mockImplementation((reponse, navigate) => Promise.resolve())
        const mockResponse: IServerResponse<IErrorResponse> = {
            code: 404,
            ok: true,
            body: {
                code: 404,
                name:'NotFoundError',
                message: 'Not Found'
            }
        };
        const mockHandler = jest.fn();
        const { result } = renderHook(() => useHandleRequestResponse(mockHandler));
        await result.current(mockResponse);
        expect(mockedErrorHandler).toHaveBeenCalledWith(mockResponse.body, expect.any(Function));
    })
})