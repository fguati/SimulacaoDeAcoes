import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react"
import NegotiationHistoryPage from '..'
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider'
import { fetchFromServer } from 'utils/BackendAPICommunication'
import userEvent from '@testing-library/user-event'

jest.mock('utils/BackendAPICommunication')

describe('testing negotiation history page', () => {
    const mockedFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>
    const mockedNumberOfPages = 3
    const mockedAPIRes = {
        code: 200,
        ok: true,
        body: {
            negotiations: [
                {
                    id: '1',
                    tradeDate: '12/07/2023',
                    tradedQty: 7,
                    tradedStock: 'AAPL',
                    tradePrice: 12.74,
                    tradeType: 'BUY'
                },
                {
                    id: '2',
                    tradeDate: '24/06/2023',
                    tradedQty: 14,
                    tradedStock: 'WEGE3',
                    tradePrice: 37.41,
                    tradeType: 'SELL'
                },
                {
                    id: '3',
                    tradeDate: '05/07/2004',
                    tradedQty: 72,
                    tradedStock: 'BBAS3',
                    tradePrice: 2.74,
                    tradeType: 'BUY'
                },
            ],
            numberOfPages: mockedNumberOfPages
        }
    }

    beforeEach(() => {
        mockedFetchFromServer.mockResolvedValue(mockedAPIRes)
    })

    it('must have basic components', () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        const title = screen.queryByText('History', {exact: false})
        expect(title).toBeInTheDocument()
    })

    it('must fetch negotiation list from backend and render it on the screen', async () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        await waitFor(() => expect(mockedFetchFromServer).toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 1 }))

        mockedAPIRes.body.negotiations.forEach(async (negotiation) => {
            const date = await screen.findByText(negotiation.tradeDate)
            const ticker = await screen.findByText(negotiation.tradedStock)
            const price = await screen.findByText(negotiation.tradePrice)
            const qty = await screen.findByText(negotiation.tradedQty)
            const type = await screen.findByText(negotiation.tradeType)

            expect(date).toBeInTheDocument()
            expect(ticker).toBeInTheDocument()
            expect(price).toBeInTheDocument()
            expect(qty).toBeInTheDocument()
            expect(type).toBeInTheDocument()
        })

    })

    it('must render the pagination elements with the correct current page number', async () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        const prevPageButton = await screen.findByLabelText('previousPage')
        const nextPageButton = await screen.findByLabelText('nextPage')
        const currentPageNumber = await screen.findByLabelText('currentPageNumber')

        expect(prevPageButton).toBeInTheDocument()
        expect(nextPageButton).toBeInTheDocument()
        expect(currentPageNumber.textContent).toBe("1")
    })

    it('must handle page changes',async () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        const prevPageButton = await screen.findByLabelText('previousPage')
        const nextPageButton = await screen.findByLabelText('nextPage')
        const currentPageNumber = await screen.findByLabelText('currentPageNumber')

        userEvent.click(nextPageButton)

        await waitFor(() => expect(mockedFetchFromServer).toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 2 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('2'))
        
        userEvent.click(prevPageButton)

        await waitFor(() => expect(mockedFetchFromServer).toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 1 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('1'))
    })
    
    it('must not change pages beyond the defined boundaries',async () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        const prevPageButton = await screen.findByLabelText('previousPage')
        const nextPageButton = await screen.findByLabelText('nextPage')
        const currentPageNumber = await screen.findByLabelText('currentPageNumber')

        userEvent.click(nextPageButton)
        userEvent.click(nextPageButton)
        
        await waitFor(() => expect(mockedFetchFromServer).toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 3 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('3'))
        
        userEvent.click(nextPageButton)

        await waitFor(() => expect(mockedFetchFromServer).not.toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 4 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('3'))
        
        userEvent.click(prevPageButton)
        userEvent.click(prevPageButton)
        
        await waitFor(() => expect(mockedFetchFromServer).toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 1 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('1'))
        
        userEvent.click(prevPageButton)

        await waitFor(() => expect(mockedFetchFromServer).not.toBeCalledWith('user/history', 'get', null, { resultsPerPage: 10, pageNumber: 0 }))
        await waitFor(() => expect(currentPageNumber.textContent).toBe('1'))
        
    })
})