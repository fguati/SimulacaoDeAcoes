import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react"
import useFetchUserBalance from "../CustomHooks/useFetchUserBalance"
import { UserAssetContext, UserAssetProvider } from ".."
import { useContext } from "react"
import { useNavigate } from 'react-router-dom'
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider'

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        ...originalModule,
        useNavigate: jest.fn()
    }
})

jest.mock("../CustomHooks/useFetchUserBalance")

describe('User Balance Context', () => {
    const mockedInitialBalance = 100
    
    const MockedCustomHookBalance = useFetchUserBalance as jest.MockedFunction<typeof useFetchUserBalance>
    const MockedFetchBalance = jest.fn()
    const MockNavigatye = useNavigate as jest.MockedFunction<typeof useNavigate>

    beforeEach(() => {
        MockedFetchBalance.mockResolvedValue(mockedInitialBalance)
        MockedCustomHookBalance.mockReturnValue(MockedFetchBalance)
        MockNavigatye.mockReturnValue(jest.fn())
        
    })
    
    const TestComponent = () => {
        const { userBalance } = useContext(UserAssetContext)

        return(
            <>
                <p>{`balance: ${userBalance}`}</p>
            </>
        )
    }

    it('must call the useFetchUserBalance custom hook and the function rendered by it', () => {
        render(
            <GlobalContextProvider>
                <UserAssetProvider>
                    <TestComponent/>
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
                    <TestComponent/>
                </UserAssetProvider>
            </GlobalContextProvider>
        )

        const userBalance = await screen.findByText('balance', {exact: false})
        await waitFor(() => expect(userBalance).toHaveTextContent(`balance: ${mockedInitialBalance}`))
        
    })

})