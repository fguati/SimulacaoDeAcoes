import LoginPage from "Pages/Login"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'
import { SessionProvider } from "Common/Contexts/SessionContext"
import { CookiesProvider } from "react-cookie"
import { SnackbarProvider } from "Common/Contexts/SnackbarContext"
import Snackbar from "Components/Snackbar"

describe('test login page render of login page', () => {
    
    test('Page must render with fields email and password and submit button', () => {
        
        render(
            <SessionProvider>
                <SnackbarProvider>
                    <LoginPage/>
                </SnackbarProvider>
            </SessionProvider>
        , {wrapper:MemoryRouter})

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
                    <SnackbarProvider>
                        <LoginPage/>
                    </SnackbarProvider>
                </CookiesProvider>
            </SessionProvider>,
            {wrapper:MemoryRouter}
        )
    }

    const validCredentials = {
        email: 'validlogin@user',
        password: '123'
    }

    test.skip('When submit button is clicked, a request must be made to the correct endpoint in the backend with the data of the form', () => {
        renderLoginPage()
        const $submitButton = screen.getByText('Submit')
        const $emailField = screen.getByLabelText('E-mail')
        const $passwordField = screen.getByLabelText('Password')

        fireEvent.change($emailField, { target: { value: validCredentials.email } })
        fireEvent.change($passwordField, { target: { value: validCredentials.password } })
        fireEvent.click($submitButton)
    })

    test.todo('When submit button is clicked, if email and password are correct, must receive a success response and set session context to logged in')
    test.todo('When submit button is clicked, if either email or password fields are empty, receive an error response')
    test.todo('When submit button is clicked, if email is not registered, must receive an error response')
    test.todo('When submit button is clicked, if password is incorrect, must receive an error response')
    test.todo('If receives a response error from the backend, must redirect to error page')
})

describe('test validators of login page', () => {
    jest.useFakeTimers()
    function renderLoginPage() {
        return render(
            <SessionProvider>
                <CookiesProvider>
                    <SnackbarProvider>
                        <LoginPage/>
                        <Snackbar/>
                    </SnackbarProvider>
                </CookiesProvider>
            </SessionProvider>,
            {wrapper:MemoryRouter}
        )
    }

    test('if email field is blurred while empty, error snackbar must be rendered and mention the email field being empty', () => {
        renderLoginPage()

        const $emailInput = screen.getByLabelText('E-mail')
        const $passwordInput = screen.getByLabelText('Password')
        expect($emailInput.textContent).toBe('')

        fireEvent.blur($emailInput, {relatedTarget: $passwordInput})
        const $snackbar = screen.getByText('invalid value', {exact: false})
        expect($snackbar.textContent).toEqual(expect.stringContaining('E-mail'))
        expect($snackbar.textContent).toEqual(expect.stringContaining('empty'))
    })

    test('if password field is blurred while empty, error snackbar must be rendered and mention the password field being empty', () => {
        renderLoginPage()

        const $passwordInput = screen.getByLabelText('Password')
        const $emailInput = screen.getByLabelText('E-mail')
        expect($passwordInput.textContent).toBe('')

        fireEvent.blur($passwordInput, {relatedTarget: $emailInput})
        const $snackbar = screen.getByText('invalid value', {exact: false})
        expect($snackbar.textContent).toEqual(expect.stringContaining('Password'))
        expect($snackbar.textContent).toEqual(expect.stringContaining('empty'))
    })

    test('if all fields are filled, there must be no snackbar rendering on blur', () => {
        renderLoginPage()

        const $emailInput = screen.getByLabelText('E-mail')
        expect($emailInput.textContent).toBe('')
        const $passwordInput = screen.getByLabelText('Password')
        expect($passwordInput.textContent).toBe('')

        fireEvent.change($passwordInput, { target: { value: 'enteredPassword' } })
        fireEvent.blur($passwordInput)

        let $snackbar = screen.queryByText('invalid value', {exact: false})
        expect($snackbar).toBe(null)

        fireEvent.change($passwordInput, { target: { value: '' } })
        fireEvent.change($emailInput, { target: { value: 'enteredEmail' } })
        fireEvent.blur($emailInput)

        $snackbar = screen.queryByText('invalid value', {exact: false})
        expect($snackbar).toBe(null)

        fireEvent.change($passwordInput, { target: { value: 'enteredPassword' } })
        fireEvent.change($emailInput, { target: { value: 'enteredEmail' } })
        fireEvent.blur($emailInput)

        $snackbar = screen.queryByText('invalid value', {exact: false})
        expect($snackbar).toBe(null)
    })

    test('if any field is empty, the submit button must be disabled, and enabled otherwise', () => {
        renderLoginPage()
        const $button = screen.getByText('Submit')

        const $emailInput = screen.getByLabelText('E-mail')
        const $passwordInput = screen.getByLabelText('Password')

        expect($button).toHaveProperty('disabled', true)

        fireEvent.change($emailInput, { target: {value: 'filled'} })
        expect($button).toHaveProperty('disabled', true)

        fireEvent.change($emailInput, { target: {value: ''} })
        fireEvent.change($passwordInput, { target: {value: 'filled'} })
        expect($button).toHaveProperty('disabled', true)

        fireEvent.change($emailInput, { target: {value: 'filled'} })
        expect($button).toHaveProperty('disabled', false)

    })
})