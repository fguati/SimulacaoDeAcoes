import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ISnackbarContext, SnackbarContext } from 'Common/Contexts/SnackbarContext';
import { ReactChildren } from 'Common/Types';
import IFormField from 'Interfaces/IFormField';
import useSubmitStockConsult from 'Pages/HomeBrokerPage/Components/ConsultStockForm/CustomHooks/useSubmitStockConsult';

//mock web API
jest.mock('utils/FinanceAPIComm', () => ({
    fetchStockInfo: jest.fn().mockResolvedValue([
        {
            ticker: 'AAPL',
            currentPrice: 150.0,
        },
    ]),
}));

describe('useSubmitStockConsult', () => {
    //mock snackbar context
    const mockActivateSnackbar = jest.fn()
    const mockSnackbarContext: ISnackbarContext = {
        activateSnackbar: mockActivateSnackbar,
        active: false,
        colorPalette: 'neutral',
        deactivateSnackbar: jest.fn(),
        overwriteDeactivationTimer: jest.fn(),
        snackbarMessage: 'Default message',
        snackBarPosition: '-7vh'
    }
    const hookWrapper = ({ children }: { children: ReactChildren }) => (
        <SnackbarContext.Provider value={mockSnackbarContext}>
            {children}
        </SnackbarContext.Provider>
    )

    // Create mock form fields
    const formFields: IFormField[] = [
        {
            name: 'Stock to check',
            value: 'AAPL',
            type: 'text'
        },
    ];

    // Mock the necessary utility functions
    const fetchStockInfo = jest
        .requireMock('utils/FinanceAPIComm')
        .fetchStockInfo;

    it('returns a submitForm function', () => {
        // Render the hook
        const { result } = renderHook(() => useSubmitStockConsult(jest.fn()), { wrapper: hookWrapper });

        // Get the submitForm function
        const submitForm = result.current;

        // Assert that submitForm is a function
        expect(typeof submitForm).toBe('function');
    });

    it('calls the necessary functions and sets stockInfo on success', async () => {
        fetchStockInfo.mockResolvedValueOnce([
            {
                ticker: 'AAPL',
                currentPrice: 150.0,
            },
        ]);

        // Create a mock setStockInfo function
        const setStockInfo = jest.fn();

        // Render the hook
        const { result } = renderHook(() => useSubmitStockConsult(setStockInfo), { wrapper: hookWrapper });

        // Get the submitForm function
        const submitForm = result.current;

        // Call the submitForm function
        await submitForm(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(fetchStockInfo).toHaveBeenCalledWith(['AAPL']);
        expect(setStockInfo).toHaveBeenCalledWith({
            ticker: 'AAPL',
            currentPrice: 150.0,
        });
        expect(mockActivateSnackbar).not.toHaveBeenCalled();
    });

    it('calls the necessary functions and handles error', async () => {
        fetchStockInfo.mockRejectedValueOnce(new Error('API error'));

        // Create a mock setStockInfo function
        const setStockInfo = jest.fn();

        // Render the hook
        const { result } = renderHook(() => useSubmitStockConsult(setStockInfo), { wrapper: hookWrapper });

        // Get the submitForm function
        const submitForm = result.current;

        // Call the submitForm function
        await submitForm(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(fetchStockInfo).toHaveBeenCalledWith(['AAPL']);
        await waitFor(() => expect(setStockInfo).toHaveBeenCalledWith(undefined));
        expect(mockActivateSnackbar).toHaveBeenCalledWith(
            'API error',
            expect.objectContaining({ colorPalette: 'failure' })
        );

    });
});
