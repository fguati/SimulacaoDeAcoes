import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import HomePage from '..';
import useFetchPortfolio from '../utils/fetchPortfolio';
import IStock from 'Interfaces/IStock';
import { fetchFromServer } from 'utils/BackendAPICommunication';
jest.mock('../utils/fetchPortfolio', () => jest.fn());
jest.mock('utils/BackendAPICommunication', () => {
    const originalModule = jest.requireActual('utils/BackendAPICommunication')

    return {
        ...originalModule,
        fetchFromServer: jest.fn()
    }
})


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
    const mockUseFetchPortfolio = useFetchPortfolio as jest.MockedFunction<typeof useFetchPortfolio>
    const mockedFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>

    beforeEach(() => {
        mockedFetchFromServer.mockResolvedValue({
            code: 200,
            ok: true,
            body: { balance: mockBalance }
        })
        mockedFetchPortfolio.mockResolvedValue(mockedStockList)
        mockUseFetchPortfolio.mockReturnValue(mockedFetchPortfolio)
    })

    test('renders the component and fetches portfolio', async () => {

        // Render the component
        render(<HomePage />);

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
        render(<HomePage />);

        const userBalance = await screen.findByText(mockBalance.toString(), { exact: false })
        expect(userBalance).toBeInTheDocument()
    })
});