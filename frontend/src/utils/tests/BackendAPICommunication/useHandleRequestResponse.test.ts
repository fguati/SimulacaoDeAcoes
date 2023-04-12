import { renderHook } from '@testing-library/react-hooks';
import { handleErrorResponse, useHandleRequestResponse } from 'utils/BackendAPICommunication';

jest.mock('react-router-dom', () => ({
  Navigate: () => null,
  useNavigate: () => jest.fn(),
}));

jest.mock('utils/BackendAPICommunication/handleErrorResponse', () => {
    return jest.fn()
})

describe('Tests for the useHandleRequestResponse custom hook', () => {
    const mockedErrorHandler = handleErrorResponse as jest.MockedFunction<typeof handleErrorResponse> 
    
    it('calls the happy path handler with response if status code is below 400', async () => {
        const mockResponse = new Response('success', { status: 200 });
        const mockHandler = jest.fn();
        const { result } = renderHook(() => useHandleRequestResponse(mockHandler));
        await result.current(mockResponse);
        expect(mockHandler).toHaveBeenCalledWith(mockResponse, expect.any(Function));
    })

    it('calls handleErrorResponse if status code is above 399', async () => {
        mockedErrorHandler.mockImplementation((reponse, navigate) => Promise.resolve())
        const mockResponse = new Response('error', { status: 404 });
        const mockHandler = jest.fn();
        const { result } = renderHook(() => useHandleRequestResponse(mockHandler));
        await result.current(mockResponse);
        expect(mockedErrorHandler).toHaveBeenCalledWith(mockResponse, expect.any(Function));
    })
})