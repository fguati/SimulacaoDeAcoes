import SignUpPage from ".."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'

describe('test page render and unit behavior of sign up page', () => {
    test('Page must render with fields email, password, Confirm Password and Username', () => {
        
        render(<SignUpPage/>, {wrapper:MemoryRouter})

        const $emailField = screen.queryByLabelText('E-mail')
        const $passwordFields = screen.queryAllByLabelText('Password')
        const $passwordField = $passwordFields[0]
        const $usernameField = screen.queryByLabelText('Username')
        const $confrimePasswordField = $passwordFields[1]
        const $submitButton = screen.queryByText('Submit')

        expect($emailField).toBeInTheDocument()
        expect($passwordField).toHaveAttribute('name', 'Password')
        expect($confrimePasswordField).toHaveAttribute('name', 'Confirm Password')
        expect($usernameField).toBeInTheDocument()
        expect($submitButton).toBeInTheDocument()
    })

    test.todo('useSubmitSignUp hook must be called')
    test.todo('fuction returned by useSubmitSignUp hook must be called when submit button is clicked')

})

describe('test integration behavior of Sign Up Page', () => {
    test.todo('When submit button is clicked, a request must be made to the correct endpoint in the backend with the data of the form')
    test.todo('When submit button is clicked, if all data is filled correctly, must receive a success response and redirect to login page')
    test.todo('When submit button is clicked, if any field is empty, receive an error response')
    test.todo('When submit button is clicked, if email is already registered, must receive an error response')
    test.todo('If receives a response error from the backend, must redirect to error page')
})