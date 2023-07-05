import { renderHook } from '@testing-library/react-hooks';
import useAddStockValidator from '../../Components/BuyForm/CustomHooks/useBuyFormFields';
import IFormField from 'Interfaces/IFormField';
import { fieldIsNotEmpty, useStockExistsValidator } from 'utils/FormValidators';

// Mock the form fields
const mockFormFields: IFormField[] = [
    {
        name: 'Stock to Buy',
        type: 'text',
        value: '',
        validators: [],
        fieldProperty: 'stockToTrade',
    },
    {
        name: 'Number of Stocks to Buy',
        type: 'number',
        value: 0,
        validators: [],
        fieldProperty: 'qtyToTrade',
    },
];

// Mock the validators hook
const mockStockExistsValidator = jest.fn()

jest.mock('utils/FormValidators', () => ({
    useStockExistsValidator: jest.fn(),
    fieldIsNotEmpty: jest.fn()
}));

describe('useAddStockValidator', () => {
    const mockStockExistsCustomHook = useStockExistsValidator as jest.MockedFunction<typeof useStockExistsValidator>
    const mockFieldIsNotEmpty = fieldIsNotEmpty as jest.MockedFunction<typeof fieldIsNotEmpty>

    it('adds the stock exists validator to the form fields', () => {
        mockStockExistsCustomHook.mockReturnValue(mockStockExistsValidator)
        
        // Render the hook
        const { result } = renderHook(() => useAddStockValidator(mockFormFields));

        // Get the updated form fields
        const updatedFormFields = result.current;

        // Find the form field that should have the stock exists validator
        const stock2BuyField = updatedFormFields.find(
            (field) => field.name === 'Stock to Buy'
        );

        // Assert that the validator was added correctly
        expect(mockStockExistsCustomHook).toBeCalled()
        expect(stock2BuyField).toBeDefined();
        expect(stock2BuyField?.validators).toEqual(expect.arrayContaining([mockFieldIsNotEmpty, mockStockExistsValidator])); // Includes the stock exists validator
    });
});
