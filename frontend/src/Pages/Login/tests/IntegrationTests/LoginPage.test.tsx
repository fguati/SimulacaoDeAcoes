import LoginPage from "Pages/Login"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'
import { SessionProvider } from "Common/Contexts/SessionContext"
import { CookiesProvider } from "react-cookie"

describe('test login page render of login page', () => {
    
    
    test('Page must render with fields email and password and submit button', () => {
        
        render(<LoginPage/>, {wrapper:MemoryRouter})

        const $emailField = screen.queryByLabelText('E-mail')
        const $passwordField = screen.queryByLabelText('Password')
        const $submitButton = screen.getByText('Submit')

        expect($emailField).toBeInTheDocument()
        expect($passwordField).toHaveAttribute('name', 'Password')
        expect($submitButton).toHaveAttribute('type', 'submit')
    })




})

describe('test integration of login page with backend', () => {
    function renderLoginPage() {
        return render(
            <SessionProvider>
                <CookiesProvider>
                    <LoginPage/>
                </CookiesProvider>
            </SessionProvider>,
            {wrapper:MemoryRouter}
        )
    }

    test.todo('When submit button is clicked, a request must be made to the correct endpoint in the backend with the data of the form')
    test.todo('When submit button is clicked, if email and password are correct, must receive a success response and set session context to logged in')
    test.todo('When submit button is clicked, if either email or password fields are empty, receive an error response')
    test.todo('When submit button is clicked, if email is not registered, must receive an error response')
    test.todo('When submit button is clicked, if password is incorrect, must receive an error response')
    test.todo('If receives a response error from the backend, must redirect to error page')
})