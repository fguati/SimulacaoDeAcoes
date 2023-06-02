import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import HomePage from '..';
import useFetchPortfolio from '../utils/fetchPortfolio';
import IStock from 'Interfaces/IStock';
jest.mock('../utils/fetchPortfolio', () => jest.fn());


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
    
    const mockedFetchPortfolio = jest.fn()


    const mockUseFetchPortfolio = useFetchPortfolio as jest.MockedFunction<typeof useFetchPortfolio>

    test('renders the component and fetches portfolio', async () => {
        mockedFetchPortfolio.mockResolvedValue(mockedStockList)
        mockUseFetchPortfolio.mockReturnValue(mockedFetchPortfolio)

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
});