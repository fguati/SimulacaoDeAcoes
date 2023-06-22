import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import useFetchUserBalance from "../CustomHooks/useFetchUserBalance"
import { UserAssetContext, UserAssetProvider } from ".."
import { useContext } from "react"
import { useNavigate } from 'react-router-dom'
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider'
import usePostDeposit from '../CustomHooks/usePostDeposit'

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        ...originalModule,
        useNavigate: jest.fn()
    }
})

jest.mock("../CustomHooks/useFetchUserBalance")
jest.mock('../CustomHooks/usePostDeposit')
jest.mock('../CustomHooks/fetchPortfolio', () => () => jest.fn().mockResolvedValue([
    {
        ticker: 'WEGE3',
        companyName: 'Weg SA',
        currentPrice: 44.23
    }
]))

describe('User Balance Context', () => {
    const mockedInitialBalance = 100
    const updatedBalance = 50
    const updatedStockList = [{
        ticker: 'ITSA4',
        companyName: 'Itausa',
        currentPrice: 14.73
    }]

    const MockedCustomHookBalance = useFetchUserBalance as jest.MockedFunction<typeof useFetchUserBalance>
    const MockedFetchBalance = jest.fn()
    const MockNavigatye = useNavigate as jest.MockedFunction<typeof useNavigate>
    const MockedUsePostDeposit = usePostDeposit as jest.MockedFunction<typeof usePostDeposit>
    const MockPostDeposit = jest.fn()

    beforeEach(() => {
        MockedFetchBalance.mockResolvedValue(mockedInitialBalance)
        MockedCustomHookBalance.mockReturnValue(MockedFetchBalance)
        MockNavigatye.mockReturnValue(jest.fn())
        MockedUsePostDeposit.mockReturnValue(MockPostDeposit)

    })

    const TestComponent = () => {
        const { userBalance, postDeposit, stockList, updateUserAssets } = useContext(UserAssetContext)
        return (
            <>
                <p>{`balance: ${userBalance}`}</p>
                <p data-testid='stockList'>{JSON.stringify(stockList)}</p>
                <button onClick={() => postDeposit(100)}>postDeposit</button>
                <button onClick={() => updateUserAssets(updatedBalance, updatedStockList)}>updateUserAssets</button>
            </>
        )
    }

    it('must call the useFetchUserBalance custom hook and the function rendered by it', () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent />
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        expect(MockedCustomHookBalance).toBeCalled()
        expect(MockedFetchBalance).toBeCalled()
    })

    it('must provide an user balance state', async () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent />
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        const userBalance = await screen.findByText('balance', { exact: false })
        await waitFor(() => expect(userBalance).toHaveTextContent(`balance: ${mockedInitialBalance}`))

    })

    it('must call the usePostDeposit hook and make the postDeposit function available', async () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent />
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        const postDepositBtn = await screen.findByText('postDeposit')
        fireEvent.click(postDepositBtn)
        expect(MockedUsePostDeposit).toBeCalled()
        await waitFor(() => expect(MockPostDeposit).toBeCalledWith(100))

    })

    it('must provide a stock list state', async () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent />
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        const stockListComponent = await screen.findByTestId('stockList')
        await waitFor(() => expect(stockListComponent).toHaveTextContent(JSON.stringify({
            ticker: 'WEGE3',
            companyName: 'Weg SA',
            currentPrice: 44.23
        })))

    })

    it('must update states when updateUserAssets is called', async () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent />
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        const updateBtn = await screen.findByText('updateUserAssets')
        fireEvent.click(updateBtn)
        
        const userBalance = await screen.findByText('balance', { exact: false })
        const stockListComponent = await screen.findByTestId('stockList')

        await waitFor(() => expect(stockListComponent).toHaveTextContent(JSON.stringify(updatedStockList)))
        await waitFor(() => expect(userBalance).toHaveTextContent(`balance: ${updatedBalance}`))

    })

})