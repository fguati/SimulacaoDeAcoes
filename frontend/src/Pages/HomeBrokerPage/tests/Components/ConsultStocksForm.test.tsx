import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ISnackbarContext, SnackbarContext } from 'Common/Contexts/SnackbarContext';
import { ReactChildren } from 'Common/Types';
import StockConsultForm from 'Pages/HomeBrokerPage/Components/ConsultStockForm';

// Mock the necessary contexts and their values
jest.mock('utils/FinanceAPIComm');

describe('StockConsultForm', () => {
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
    const componentWrapper = ({ children }: { children: ReactChildren }) => (
        <SnackbarContext.Provider value={mockSnackbarContext}>
            {children}
        </SnackbarContext.Provider>
    )

    //mock web API
    const fetchStockInfo = jest
        .requireMock('utils/FinanceAPIComm')
        .fetchStockInfo;
    

    it('renders the form and displays stock information on successful submit', async () => {
        //mock finance web API result
        fetchStockInfo.mockResolvedValue([{
            ticker: 'AAPL',
            currentPrice: 150.0,
            companyName: 'Apple Inc.',
        }])

        // Render the component
        render(<StockConsultForm />, { wrapper: componentWrapper });

        // Get the form fields and submit button
        const stockInput = screen.getByPlaceholderText('Enter stock to be searched');
        const submitButton = screen.getByText('Search Stock');

        // Enter a stock value in the input field
        userEvent.type(stockInput, 'AAPL')

        // Submit the form
        userEvent.click(submitButton)

        // Wait for the stock information to be displayed
        const companyName = await screen.findByText('Apple Inc.');
        const currentPrice = await screen.findByText('150.00', {exact: false});

        // Assert that the stock information is displayed correctly
        await waitFor(() => expect(companyName).toBeInTheDocument())
        await waitFor(() => expect(currentPrice).toBeInTheDocument())
    });

});
