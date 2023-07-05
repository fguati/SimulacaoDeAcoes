import { render, fireEvent, screen } from '@testing-library/react';

import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider';
import SellForm from '../../Components/SellForm';
import useAddPortfolioAsSelectOptions from '../../Components/SellForm/Custom Hooks/useAddSelectOptions';

// Mock the custom hooks used in BuyForm
jest.mock('Pages/HomeBrokerPage/CustomHooks/useSubmitTrade', () => jest.fn());
jest.mock('../../Components/SellForm/Custom Hooks/useAddSelectOptions', () => jest.fn())

describe('SellForm', () => {
    const mockUseAddSelectOptions = useAddPortfolioAsSelectOptions as jest.MockedFunction<typeof useAddPortfolioAsSelectOptions>

    it('renders the form fields and calls submitTrade on form submission', () => {
        mockUseAddSelectOptions.mockImplementation((fields) => {
            const modifiedFields = fields
            const index = modifiedFields.findIndex(field => field.name === 'Stock to Sell')
            modifiedFields[index].selectOptions = ['AAPL']
            return modifiedFields
        })
        
        // Mock the submitTrade function
        const submitTradeMock = jest.fn();
        require('Pages/HomeBrokerPage/CustomHooks/useSubmitTrade').mockImplementation(() => submitTradeMock);

        render(
            <GlobalContextProvider>
                <SellForm />
            </GlobalContextProvider>
        );

        // Find the form fields and submit button
        const stockInput = screen.getByRole('combobox')
        const qtyInput = screen.getByPlaceholderText('Enter the number of stocks to sell');
        const submitButton = screen.getByRole('button', { name: 'Sell' });

        // Fill in the form fields
        fireEvent.change(stockInput, { target: { value: 'AAPL' } });
        fireEvent.change(qtyInput, { target: { value: 10 } });

        // Submit the form
        fireEvent.click(submitButton);

        // Assert that submitTrade was called with the correct values
        expect(submitTradeMock).toHaveBeenCalled();
        expect(mockUseAddSelectOptions).toBeCalled()
    });
});
