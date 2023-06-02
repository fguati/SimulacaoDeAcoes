import { renderHook } from '@testing-library/react-hooks';
import useFetchUserBalance from 'Pages/HomePage/utils/useFetchUserBalance';
import { fetchFromServer, handleErrorResponse } from 'utils/BackendAPICommunication';
import transformErrorInResponse from 'utils/BackendAPICommunication/responseHandlers/transformErrorInResponse';
import { useNavigate } from 'react-router-dom'

jest.mock('react-router-dom', () => {
    const originalMod = jest.requireActual('react-router-dom')
    return {
        ...originalMod,
        useNavigate: jest.fn()
    }
})
jest.mock('utils/BackendAPICommunication', () => ({
    fetchFromServer: jest.fn(),
    handleErrorResponse: jest.fn(),
}));

jest.mock('utils/BackendAPICommunication/responseHandlers/transformErrorInResponse', () => jest.fn());

describe('useFetchUserBalance', () => {
    const mockBalance = 100;

    const navigateMock = jest.fn();
    const mockFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>
    const mockHandleErrorResponse = handleErrorResponse as jest.MockedFunction<typeof handleErrorResponse>
    const mockTransformError = transformErrorInResponse as jest.MockedFunction<typeof transformErrorInResponse>

    const errorResponse = {
        code: 500,
        message: 'Internal Server Error',
        name: 'ServerError',
    };

    beforeEach(() => {
        (useNavigate as jest.MockedFunction<typeof useNavigate>).mockReturnValue(navigateMock)
        mockFetchFromServer.mockClear();
        mockHandleErrorResponse.mockClear();
        mockTransformError.mockClear();
    });

    test('should fetch and return user balance', async () => {
        const expectedResponse = {
            code: 200,
            ok: true,
            body: { balance: mockBalance },
        };
        mockFetchFromServer.mockResolvedValueOnce(expectedResponse);
        const { result } = renderHook(() => useFetchUserBalance());
        expect(result.current).toBeInstanceOf(Function);

        const fetchBalance = result.current;
        const balance = await fetchBalance();

        expect(mockFetchFromServer).toHaveBeenCalledWith('/user/balance');
        expect(balance).toEqual(mockBalance);
        expect(navigateMock).not.toHaveBeenCalled();
        expect(mockHandleErrorResponse).not.toHaveBeenCalled();
        expect(mockTransformError).not.toHaveBeenCalled();
    });

    test('should handle error response', async () => {
        mockFetchFromServer.mockRejectedValueOnce(errorResponse);
        mockHandleErrorResponse.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useFetchUserBalance());
        expect(result.current).toBeInstanceOf(Function);

        const fetchBalance = result.current;
        await fetchBalance();

        expect(mockFetchFromServer).toHaveBeenCalledWith('/user/balance');
        expect(navigateMock).not.toHaveBeenCalled();
        expect(mockHandleErrorResponse).toHaveBeenCalledWith(errorResponse, navigateMock);
        expect(mockTransformError).not.toHaveBeenCalled();
    });

    test('should handle error thrown', async () => {
        const error = new Error('Unknown error');
        mockFetchFromServer.mockRejectedValueOnce(error);
        mockTransformError.mockReturnValueOnce(errorResponse);
        mockHandleErrorResponse.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useFetchUserBalance());
        expect(result.current).toBeInstanceOf(Function);

        const fetchBalance = result.current;
        await fetchBalance();

        expect(mockFetchFromServer).toHaveBeenCalledWith('/user/balance');
        expect(navigateMock).not.toHaveBeenCalled();
        expect(mockHandleErrorResponse).toHaveBeenCalledWith(errorResponse, navigateMock);
        expect(mockTransformError).toHaveBeenCalledWith(error);
    });
});