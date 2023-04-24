import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import '@testing-library/jest-dom'
import AuthRequestBranch from "."
import { SessionContext } from "Common/Contexts/SessionContext"
import { ISnackbarContext, SnackbarContext } from "Common/Contexts/SnackbarContext"
import LoginPage from "Pages/Login"

jest.mock('Pages/Login', () => jest.fn())


describe('Testing the component responsible for checking if user is logged in and redirecting accordingly', () => {
    interface IMockedSessionContext {
        getLogInStatus: () => boolean
        loggedIn: boolean
    }

    const MockedLoginPage = LoginPage as jest.MockedFunction<typeof LoginPage>

    const mockedActivateSnackBar = jest.fn()
    
    const MockedSnackBarContext: ISnackbarContext = {
        activateSnackbar: mockedActivateSnackBar,
        active: false,
        colorPalette: 'neutral',
        deactivateSnackbar: jest.fn(),
        snackbarMessage: '',
        snackBarPosition: '0vh'
    }
    
    function TestComponent() {
        return(<p>test</p>)
    }
    
    function renderAuthBranch(mockedSessionContext: IMockedSessionContext) {
        render(
            <SessionContext.Provider value={mockedSessionContext}>
                <SnackbarContext.Provider value={MockedSnackBarContext}>
                    <MemoryRouter>
                        <Routes>
                            <Route element={<AuthRequestBranch/>}>
                                <Route element={<TestComponent/>} path="/"/>
                            </Route>
                        </Routes>
                    </MemoryRouter>
                </SnackbarContext.Provider>
            </SessionContext.Provider>
        )
    }

    test('calls activate snackbar and renders login page if user is not logged in', () => {
        MockedLoginPage.mockReturnValue((<p>Mocked Login Page</p>))
        const mockedSessionContext:IMockedSessionContext = {
            getLogInStatus: jest.fn(),
            loggedIn: false
        }

        renderAuthBranch(mockedSessionContext)

        const $mockedLoginPage = screen.getByText('Mocked Login Page')
        expect(mockedActivateSnackBar).toBeCalledWith(expect.any(String), { colorPalette: 'failure'})
        expect($mockedLoginPage).toBeInTheDocument()
    })

    test('returns outlet if user is logged in', () => {
        const mockedSessionContext:IMockedSessionContext = {
            getLogInStatus: jest.fn(),
            loggedIn: true
        }

        renderAuthBranch(mockedSessionContext)

        const $mockedOutlet = screen.getByText('test')
        expect(mockedActivateSnackBar).not.toBeCalled()
        expect($mockedOutlet).toBeInTheDocument()
    })
})