import { renderHook } from '@testing-library/react-hooks'
import { useNavigate } from 'react-router-dom'
import { ISnackbarContext, SnackbarContext } from 'Common/Contexts/SnackbarContext'
import usePostDeposit from '../CustomHooks/usePostDeposit'
import { fetchFromServer, handleErrorResponse } from 'utils/BackendAPICommunication'
import IServerResponse from 'Interfaces/IServerResponse'
import { ReactChildren } from 'Common/Types'

// Mock the dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))
jest.mock('utils/BackendAPICommunication', () => ({
    fetchFromServer: jest.fn(),
    handleErrorResponse: jest.fn()
}))

// Mock the SnackbarContext
const activateSnackbar = jest.fn()

const mockSnackbarContext: ISnackbarContext = {
    activateSnackbar,
    active: false,
    colorPalette: 'neutral',
    deactivateSnackbar: jest.fn(),
    overwriteDeactivationTimer: jest.fn(),
    snackbarMessage: 'Default message',
    snackBarPosition: '-7vh'
}

const snackBarWrapper = ({ children }: {children: ReactChildren}) => (
    <SnackbarContext.Provider value={ mockSnackbarContext }>
        {children}
    </SnackbarContext.Provider>
)

describe('usePostDeposit custom hook', () => {
    const mockedFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>
    const navigate = jest.fn()
    const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
    
    beforeEach(() => {
        mockUseNavigate.mockReturnValue(navigate)
    })

    test('should handle deposit and update balance when server API sends a happy response', async () => {
        // Set up the mock values and functions
        const balanceSetter = jest.fn()
        const funds = 100
        const newBalance = 500

        // Mock the fetchFromServer function to return a successful response
        mockedFetchFromServer.mockResolvedValueOnce({ body: { balance: newBalance } } as IServerResponse<unknown>)

        // Render the hook
        const { result } = renderHook(() => usePostDeposit(balanceSetter), {
            wrapper: snackBarWrapper
        })

        // Call the hook function
        await result.current(funds)

        // Check that the necessary functions were called with the correct arguments
        expect(fetchFromServer).toHaveBeenCalledWith('/user/deposit', 'post', { funds })
        expect(handleErrorResponse).not.toHaveBeenCalled()
        expect(activateSnackbar).toHaveBeenCalled()
        expect(balanceSetter).toHaveBeenCalledWith(newBalance)
    })

    test('should handle error in the body of the server response', async () => {
        // Set up the mock values and functions
        const balanceSetter = jest.fn()
        const funds = 100
        const errorResponse = {code: 500, message: 'Internal Server Error'}

        // Mock the fetchFromServer function to throw an error
        mockedFetchFromServer.mockResolvedValueOnce({body: errorResponse} as IServerResponse<unknown>)

        // Render the hook
        const { result } = renderHook(() => usePostDeposit(balanceSetter), {
            wrapper: snackBarWrapper
        })

        // Call the hook function
        await result.current(funds)

        // Check that the necessary functions were called with the correct arguments
        expect(fetchFromServer).toHaveBeenCalledWith('/user/deposit', 'post', { funds })
        expect(handleErrorResponse).toHaveBeenCalledWith(errorResponse, navigate)
        expect(activateSnackbar).not.toHaveBeenCalled()
        expect(balanceSetter).not.toHaveBeenCalled()
    })
      
})