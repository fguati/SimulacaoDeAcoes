import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import HomePage from '..';
import useFetchPortfolio from 'Common/Contexts/UserBalanceContext/CustomHooks/fetchPortfolio';
import IStock from 'Interfaces/IStock';
import useFetchUserBalance from 'Common/Contexts/UserBalanceContext/CustomHooks/useFetchUserBalance';
import { UserAssetProvider } from 'Common/Contexts/UserBalanceContext';
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        ...originalModule,
        useNavigate: jest.fn()
    }
})
jest.mock('Common/Contexts/UserBalanceContext/CustomHooks/fetchPortfolio', () => jest.fn());
jest.mock('Common/Contexts/UserBalanceContext/CustomHooks/useFetchUserBalance', () => jest.fn())


describe('HomePage', () => {
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
            ticker: 'EGIE3',
            companyName: 'Company B',
            qty: 64,
            currentPrice: 7.46,
            totalValue: 477.44 
        },
    ]
    const mockBalance = 500
    
    const mockedFetchPortfolio = jest.fn()
    const mockedFetchUserBalance = jest.fn()
    const mockUseFetchPortfolio = useFetchPortfolio as jest.MockedFunction<typeof useFetchPortfolio>
    const mockedUseFetchUserBalance = useFetchUserBalance as jest.MockedFunction<typeof useFetchUserBalance>

    beforeEach(() => {
        mockedFetchUserBalance.mockResolvedValue(mockBalance)
        mockedUseFetchUserBalance.mockReturnValue(mockedFetchUserBalance)
        mockedFetchPortfolio.mockResolvedValue(mockedStockList)
        mockUseFetchPortfolio.mockReturnValue(mockedFetchPortfolio)
    })

    test('renders the component and fetches portfolio', async () => {

        // Render the component
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <HomePage />
                </UserAssetProvider>
            </GlobalContextProvider>
        );

        // Assert that the component rendered correctly
        expect(await screen.findByText('Dashboard')).toBeInTheDocument();
        mockedStockList.forEach(stock => {
            const tableHeaders = Object.keys(stock)
            tableHeaders.forEach(async stockProp => {
                const key = stockProp as keyof IStock
                expect(await screen.findByText(stock[key]!.toString())).toBeInTheDocument()
            }) 
        })
    });

    it('renders component with the user balance', async () => {

        // Render the component
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <HomePage />
                </UserAssetProvider>
            </GlobalContextProvider>
        );

        const userBalance = await screen.findByText(mockBalance.toString(), { exact: false })
        expect(userBalance).toBeInTheDocument()
    })

    it('renders input to move funds', () => {
        // Render the component
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <HomePage />
                </UserAssetProvider>
            </GlobalContextProvider>
        );

        const moveFundsForm = screen.getByText('Funds to Transfer')
        const transferFundsButton = screen.getByText('Transfer')

        expect(moveFundsForm).toBeInTheDocument()
        expect(transferFundsButton).toBeInTheDocument()
    })

});