import { renderHook } from '@testing-library/react-hooks';
import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import { ISnackbarContext, SnackbarContext } from "Common/Contexts/SnackbarContext"
import IServerResponse from "Interfaces/IServerResponse"
import ITradeRes from "../Interfaces/ITradeRes"
import useTradeSuccessHandler from '../CustomHooks/useTradeSuccessHandler';
import { ReactChildren } from 'Common/Types';

describe('useTradeSuccessHandler', () => {
    // Mock the necessary context values and functions
    const mockedActivateSnackBar = jest.fn()
    const mockedSnackBarContext: ISnackbarContext = {
        activateSnackbar: mockedActivateSnackBar,
        active: false,
        colorPalette: 'neutral',
        deactivateSnackbar: jest.fn(),
        snackbarMessage: '',
        snackBarPosition: '0vh',
        overwriteDeactivationTimer: jest.fn()
    }

    const mockedUpdateUserAssets = jest.fn()
    const mockedUserContext = {
        userBalance: 1000,
        postDeposit: jest.fn(),
        stockList: [],
        updateUserAssets: mockedUpdateUserAssets
    }

    it('returns a successHandler function', () => {
        // Render the hook
        const { result } = renderHook(() => useTradeSuccessHandler(), {
            wrapper: ({ children }: { children: ReactChildren }) => (
                <SnackbarContext.Provider value={mockedSnackBarContext}>
                    <UserAssetContext.Provider value={mockedUserContext}>
                        {children}
                    </UserAssetContext.Provider>
                </SnackbarContext.Provider>
            )
        });

        // Get the successHandler function
        const successHandler = result.current;

        // Assert that successHandler is a function
        expect(typeof successHandler).toBe('function');
    });

    it('calls the necessary functions and updates user assets on successful trade', async () => {
        // Create a mock response body
        const responseBody: IServerResponse<ITradeRes> = {
            code: 200,
            ok: true,
            body: {
                newPosition: {
                    stock: 'AAPL',
                    averagePrice: 150.0,
                    qty: 10,
                },
                userBalance: 1000.0,
            },
        };

        // Render the hook
        const { result } = renderHook(() => useTradeSuccessHandler(), {
            wrapper: ({ children }: { children: ReactChildren }) => (
                <SnackbarContext.Provider value={mockedSnackBarContext}>
                    <UserAssetContext.Provider value={mockedUserContext}>
                        {children}
                    </UserAssetContext.Provider>
                </SnackbarContext.Provider>
            )
        });

        // Get the successHandler function
        const successHandler = result.current;

        // Call the successHandler function with the mock response body
        await successHandler(responseBody);

        // Assert that the necessary functions were called with the correct arguments
        expect(mockedUpdateUserAssets).toHaveBeenCalledWith(
            responseBody.body!.userBalance,
            expect.arrayContaining([{
                companyName: 'placeholder',
                currentPrice: 150.0,
                ticker: 'AAPL',
                qty: 10
            }])
        );
        expect(mockedActivateSnackBar).toHaveBeenCalledWith(
            'Purchase of AAPL successful',
            { colorPalette: 'success' }
        );
    });
});
