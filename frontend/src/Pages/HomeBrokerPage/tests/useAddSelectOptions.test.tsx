import { renderHook } from '@testing-library/react-hooks';
import { UserAssetContext } from 'Common/Contexts/UserBalanceContext';
import useAddPortfolioAsSelectOptions from '../Components/SellForm/Custom Hooks/useAddSelectOptions';
import { ReactChildren } from 'Common/Types';
import IFormField from 'Interfaces/IFormField';

// Mock the UserAssetContext value
const mockUserAssetContextValue = {
    stockList: [
        {
            ticker: 'AAPL',
            companyName: 'Apple Inc.',
            currentPrice: 150.0,
        },
        {
            ticker: 'GOOG',
            companyName: 'Alphabet Inc.',
            currentPrice: 2500.0,
        },
    ],
    userBalance: 1000,
    postDeposit: jest.fn(),
    updateUserAssets: jest.fn()
};

//Mock form fields
const mockFormFields: IFormField[] =[
    {
        name: 'Stock to Sell',
        type: 'dropdown',
        selectOptions: [],
        value: '',
    },
    {
        name: 'Number of Stocks to Sell',
        type: 'number',
        value: 0,
    }
]

describe('useAddPortfolioAsSelectOptions', () => {
    it('adds the user portfolio as select options to the form fields', () => {
        // Render the hook with a mock UserAssetContext
        const { result } = renderHook(() => useAddPortfolioAsSelectOptions(mockFormFields), {
            wrapper: ({ children }: { children: ReactChildren }) => (
                <UserAssetContext.Provider value={mockUserAssetContextValue}>
                    {children}
                </UserAssetContext.Provider>
            ),
        });

        // Get the updated form fields
        const updatedFormFields = result.current;

        // Find the form field that should receive the select options
        const stock2SellField = updatedFormFields.find(
            (field) => field.name === 'Stock to Sell'
        );

        // Assert that the select options were added correctly
        expect(stock2SellField).toBeDefined();
        expect(stock2SellField?.selectOptions).toEqual(['AAPL', 'GOOG']);
    });
});
