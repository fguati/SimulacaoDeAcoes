import { SessionContext, SessionProvider } from ".";
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useContext } from "react";
import getCookie from "utils/getCookie";
jest.mock("utils/getCookie")

describe('Unit tests of the Session Context', () => {
    const mockedGetCookie = getCookie as jest.MockedFunction<typeof getCookie>

    const ExampleComponent = () => {
        const { getLogInStatus, setLogIn } = useContext(SessionContext)
        const isLoggedIn = getLogInStatus!()
      
        return (<div>
            Logged in: {isLoggedIn.toString()}
            <button onClick={() => setLogIn!(false)}>Change to False</button>
            <button onClick={() => setLogIn!(true)}>Change to True</button>
        </div>)
    }

    test('Session Context provides getLogInStatus that returns true when getCookie returns a non-empty string', () => {
        mockedGetCookie.mockImplementation((key) => key)
        render(
            <SessionProvider>
                <ExampleComponent/>
            </SessionProvider>
        )

        const testDiv = screen.getByText(/Logged in/)
        expect(testDiv.textContent).toEqual(expect.stringContaining('true'))
    })

    test('Session Context provides getLogInStatus that returns false when getCookie returns an empty string', () => {
        mockedGetCookie.mockImplementation((key) => '')
        render(
            <SessionProvider>
                <ExampleComponent/>
            </SessionProvider>
        )

        const testDiv = screen.getByText(/Logged in/)
        expect(testDiv.textContent).toEqual(expect.stringContaining('false'))
    })

    test('When getCookies return a non-empty string, setLogIn is capable of change the state of the login', () => {
        mockedGetCookie.mockImplementation((key) => key)
        render(
            <SessionProvider>
                <ExampleComponent/>
            </SessionProvider>
        )

        const testDiv = screen.getByText(/Logged in/)
        const trueButton = screen.getByText('Change to True')
        const falseButton = screen.getByText('Change to False')

        expect(testDiv.textContent).toEqual(expect.stringContaining('true'))
        fireEvent.click(falseButton)
        expect(testDiv.textContent).toEqual(expect.stringContaining('false'))
        fireEvent.click(trueButton)
        expect(testDiv.textContent).toEqual(expect.stringContaining('true'))

    })

    test('When getCookies return an empty string, setLogIn is not capable of change the state of the login from false', () => {
        mockedGetCookie.mockImplementation((key) => '')
        render(
            <SessionProvider>
                <ExampleComponent/>
            </SessionProvider>
        )

        const testDiv = screen.getByText(/Logged in/)
        const trueButton = screen.getByText('Change to True')
        const falseButton = screen.getByText('Change to False')

        expect(testDiv.textContent).toEqual(expect.stringContaining('false'))
        fireEvent.click(falseButton)
        expect(testDiv.textContent).toEqual(expect.stringContaining('false'))
        fireEvent.click(trueButton)
        expect(testDiv.textContent).toEqual(expect.stringContaining('false'))

    })
    
})