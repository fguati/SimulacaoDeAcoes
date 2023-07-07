import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import NegotiationHistoryPage from '..'
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider'

describe('testing negotiation history page', () => {
    it('must have basic components', () => {
        render(<NegotiationHistoryPage/>, {wrapper: GlobalContextProvider})

        const title = screen.queryByText('History', {exact: false})
        expect(title).toBeInTheDocument()
    })
})