import LoginPage from "."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'


describe('test login page render and behavior', () => {
    test('Page must render with fields email and password', () => {
        
        render(<LoginPage/>, {wrapper:MemoryRouter})

        const $emailField = screen.queryByLabelText('E-mail')
        const $passwordField = screen.queryByLabelText('Password')

        expect($emailField).toBeInTheDocument()
        expect($passwordField).toBeInTheDocument()
    })
})