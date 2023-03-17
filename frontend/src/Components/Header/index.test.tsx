import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import Header from '.'

describe('Testing links in the header component', () => {
    test('header must have links login and sign up when logged out', () => {
        render(<Header/>, {wrapper: MemoryRouter})

        const loginLink = screen.queryByText('Login')
        const signUpLink = screen.queryByText('Sign Up')

        expect(loginLink).toHaveAttribute('href','/login')
        expect(signUpLink).toHaveAttribute('href','/signup')

    })

})