import { render, fireEvent, screen } from '@testing-library/react';
import BuyForm from '../../Components/BuyForm';
import useAddStockValidator from '../../Components/BuyForm/CustomHooks/useBuyFormFields'
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider';

// Mock the custom hooks used in BuyForm
jest.mock('Pages/HomeBrokerPage/CustomHooks/useSubmitTrade', () => jest.fn());
jest.mock('../../Components/BuyForm/CustomHooks/useBuyFormFields');

describe('BuyForm', () => {
    const mockUseAddStockValidator = useAddStockValidator as jest.MockedFunction<typeof useAddStockValidator>

    it('renders the form fields and calls submitTrade on form submission', () => {
        mockUseAddStockValidator.mockImplementation((fields) => fields)
        
        // Mock the submitTrade function
        const submitTradeMock = jest.fn();
        require('Pages/HomeBrokerPage/CustomHooks/useSubmitTrade').mockImplementation(() => submitTradeMock);

        render(
            <GlobalContextProvider>
                <BuyForm />
            </GlobalContextProvider>
        );

        // Find the form fields and submit button
        const stockInput = screen.getByPlaceholderText('Enter the ticker of the stock to buy');
        const qtyInput = screen.getByPlaceholderText('Enter the number of stocks to buy');
        const submitButton = screen.getByRole('button', { name: 'Buy' });

        // Fill in the form fields
        fireEvent.change(stockInput, { target: { value: 'AAPL' } });
        fireEvent.change(qtyInput, { target: { value: 10 } });

        // Submit the form
        fireEvent.click(submitButton);

        // Assert that submitTrade was called with the correct values
        expect(submitTradeMock).toHaveBeenCalled();
        expect(mockUseAddStockValidator).toBeCalled()
    });
});
