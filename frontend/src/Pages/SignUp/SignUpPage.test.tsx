import SignUpPage from "."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'

describe('test login page render and behavior', () => {
    test('Page must render with fields email, password, Confirm Password and Username', () => {
        
        render(<SignUpPage/>, {wrapper:MemoryRouter})

        const $emailField = screen.queryByLabelText('E-mail')
        const $passwordFields = screen.queryAllByLabelText('Password')
        const $passwordField = $passwordFields[0]
        const $usernameField = screen.queryByLabelText('Username')
        const $confrimePasswordField = $passwordFields[1]

        expect($emailField).toBeInTheDocument()
        expect($passwordField).toHaveAttribute('name', 'Password')
        expect($confrimePasswordField).toHaveAttribute('name', 'Confirm Password')
        expect($usernameField).toBeInTheDocument()
    })

})