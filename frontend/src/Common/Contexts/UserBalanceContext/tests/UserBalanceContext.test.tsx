import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import useFetchUserBalance from "../CustomHooks/useFetchUserBalance"
import { UserBalanceContext, UserBalanceProvider } from ".."
import { useContext } from "react"

jest.mock("../CustomHooks/useFetchUserBalance")

describe('User Balance Context', () => {
    const mockedInitialBalance = 100
    
    const MockedCustomHookBalance = useFetchUserBalance as jest.MockedFunction<typeof useFetchUserBalance>
    const MockedFetchBalance = jest.fn()

    beforeEach(() => {
        MockedFetchBalance.mockResolvedValue(mockedInitialBalance)
        MockedCustomHookBalance.mockReturnValue(MockedFetchBalance)
    })

    const TestComponent = () => {
        const { userBalance, setUserBalance } = useContext(UserBalanceContext)

        return(
            <>
                <p>{`balance: ${userBalance}`}</p>
                <button onClick={() => {
                    const newBalance = userBalance + 500
                    setUserBalance(newBalance)
                }}>{'Add funds +500'}</button>
            </>
        )
    }

    it('must call the useFetchUserBalance custom hook and the function rendered by it', () => {
        render(
            <UserBalanceProvider>
                <TestComponent/>
            </UserBalanceProvider>
        )
        
        expect(MockedCustomHookBalance).toBeCalled()
        expect(MockedFetchBalance).toBeCalled()
    })

    it('must provide an user balance state', async () => {
        render(
            <UserBalanceProvider>
                <TestComponent/>
            </UserBalanceProvider>
        )

        const userBalance = await screen.findByText('balance', {exact: false})
        await waitFor(() => expect(userBalance).toHaveTextContent(`balance: ${mockedInitialBalance}`))
        
    })

    it('must provide a setter for balance state',async () => {
        render(
            <UserBalanceProvider>
                <TestComponent/>
            </UserBalanceProvider>
        )
        const initialUserBalance = await screen.findByText('balance: 100')
        await waitFor(() => expect(initialUserBalance).toBeInTheDocument())

        const addFundsButton = screen.getByText('Add funds', {exact: false})
        fireEvent.click(addFundsButton)
        
        const userBalance = await screen.findByText('balance', {exact: false})
        await waitFor(() => expect(userBalance).toHaveTextContent(`balance: ${mockedInitialBalance + 500}`))
        
    })
})