import { renderHook } from '@testing-library/react-hooks';
import { UserAssetContext } from "Common/Contexts/UserBalanceContext";
import { ISnackbarContext, SnackbarContext } from "Common/Contexts/SnackbarContext";
import useSubmitTrade from '../../CustomHooks/useSubmitTrade';
import IFormField from 'Interfaces/IFormField';
import { ReactChildren } from 'Common/Types';
import { turnFieldListInObject, useHandleRequestResponse } from 'utils/BackendAPICommunication';
import IStock from 'Interfaces/IStock';

// Mock the necessary contexts and their values
jest.mock('utils/BackendAPICommunication', () => ({
    useHandleRequestResponse: jest.fn().mockReturnValue(jest.fn()),
    turnFieldListInObject: jest.fn(),
    fetchFromServer: jest.fn(),
}));
jest.mock('utils/FinanceAPIComm', () => ({
    fetchStockInfo: jest.fn()
}));

// Mock the SnackbarContext
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

//mock user assets context
const mockedStockList: IStock[] = [
    { 
        id: '1',
        ticker: 'WEGE3',
        companyName: 'Company A',
        qty: 20,
        currentPrice: 1.32,
        totalValue: 26.4
    },
    { 
        id: '2',
        ticker: 'AAPL',
        companyName: 'Apple',
        qty: 64,
        currentPrice: 7.46,
        totalValue: 477.44 
    },
]
const mockUserContext = {
    userBalance: 5000,
    postDeposit: jest.fn(),
    stockList: mockedStockList,
    updateUserAssets: jest.fn()
}

const hookWraperFunction = ({children}: {children:ReactChildren}) => (
    <SnackbarContext.Provider value={mockSnackbarContext}>
        <UserAssetContext.Provider value={mockUserContext}>
            {children}
        </UserAssetContext.Provider>
    </SnackbarContext.Provider>
)

// Mock the necessary utility functions
const mockTurnFieldsIntoObject = turnFieldListInObject as jest.MockedFunction<typeof turnFieldListInObject>
const mockHandleResponseCustomHook = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
const mockResponseHandler = jest.fn()
const fetchFromServer = jest
    .requireMock('utils/BackendAPICommunication')
    .fetchFromServer;
const fetchStockInfo = jest
    .requireMock('utils/FinanceAPIComm')
    .fetchStockInfo;

beforeEach(() => {
    mockHandleResponseCustomHook.mockReturnValue(mockResponseHandler)
    mockTurnFieldsIntoObject.mockReturnValue({ qtyToTrade: 10, stockToTrade: 'AAPL' })
    fetchFromServer.mockResolvedValueOnce({});
    fetchStockInfo.mockResolvedValueOnce([
        {
            ticker: 'AAPL',
            currentPrice: 150.0,
            companyName: 'Apple',
            currency: 'USD'
        }
    ])
})

describe('useSubmitTrade', () => {
    it('returns a submitTrade function', () => {
        // Render the hook
        const { result } = renderHook(() => useSubmitTrade('BUY'), {wrapper: hookWraperFunction});

        // Get the submitTrade function
        const submitTrade = result.current;

        // Assert that submitTrade is a function
        expect(typeof submitTrade).toBe('function');
        expect(mockHandleResponseCustomHook).toBeCalled()
    });

    it('calls the necessary functions and handles successful purchase', async () => {

        // Render the hook
        const { result } = renderHook(() => useSubmitTrade('BUY'), {wrapper: hookWraperFunction});

        // Get the submitTrade function
        const submitTrade = result.current;

        // Create mock form fields
        const formFields: IFormField[] = [];

        // Call the submitTrade function
        await submitTrade(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(mockTurnFieldsIntoObject).toHaveBeenCalledWith(formFields);
        expect(fetchStockInfo).toHaveBeenCalledWith(['AAPL']);
        expect(fetchFromServer).toHaveBeenCalledWith(
            '/user/trade',
            'POST',
            { qtyToTrade: 10, stockToTrade: 'AAPL', tradeType: 'BUY' }
        );
        expect(mockResponseHandler).toBeCalledWith({})
        
    }) 

    it('calls the necessary functions and handles successful sale', async () => {
        // Render the hook
        const { result } = renderHook(() => useSubmitTrade('SELL'), {wrapper: hookWraperFunction});

        // Get the submitTrade function
        const submitTrade = result.current;

        // Create mock form fields
        const formFields: IFormField[] = [];

        // Call the submitTrade function
        await submitTrade(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(mockTurnFieldsIntoObject).toHaveBeenCalledWith(formFields);
        
        expect(fetchFromServer).toHaveBeenCalledWith(
            '/user/trade',
            'POST',
            { qtyToTrade: 10, stockToTrade: 'AAPL', tradeType: 'SELL' }
        );
        expect(mockResponseHandler).toBeCalledWith({})
    })

    it('calls the necessary functions and handles failed purchase',async () => {
        //mock utility that reads form fields with invalid values
        mockTurnFieldsIntoObject.mockReturnValue({ qtyToTrade: 10000, stockToTrade: 'AAPL' })
        
        // Render the hook
        const { result } = renderHook(() => useSubmitTrade('BUY'), {wrapper: hookWraperFunction});

        // Get the submitTrade function
        const submitTrade = result.current;

        // Create mock form fields
        const formFields: IFormField[] = [];

        // Call the submitTrade function
        await submitTrade(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(mockTurnFieldsIntoObject).toHaveBeenCalledWith(formFields);
        expect(fetchStockInfo).toHaveBeenCalledWith(['AAPL']);
        expect(mockActivateSnackbar).toBeCalledWith(expect.any(String), { colorPalette: 'failure' })
  
    })

    it('calls the necessary functions and handles failed sale',async () => {
        //mock utility that reads form fields with invalid values
        mockTurnFieldsIntoObject.mockReturnValue({ qtyToTrade: 10000, stockToTrade: 'AAPL' })
        
        // Render the hook
        const { result } = renderHook(() => useSubmitTrade('SELL'), {wrapper: hookWraperFunction});

        // Get the submitTrade function
        const submitTrade = result.current;

        // Create mock form fields
        const formFields: IFormField[] = [];

        // Call the submitTrade function
        await submitTrade(formFields);

        // Assert that the necessary functions were called with the correct arguments
        expect(mockTurnFieldsIntoObject).toHaveBeenCalledWith(formFields);
        expect(mockActivateSnackbar).toBeCalledWith(expect.any(String), { colorPalette: 'failure' })
    })
})