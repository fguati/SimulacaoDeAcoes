import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import Header from '.'
import { CookiesProvider } from 'react-cookie'
import Cookies from 'js-cookie';
import { SessionProvider } from 'Common/Contexts/SessionContext'

describe('Testing links in the header component', () => {
    test('header must have links login and sign up when logged out', () => {
        render(
        <SessionProvider>
            <CookiesProvider>
                <Header/>
            </CookiesProvider>

        </SessionProvider>, 
        {wrapper: MemoryRouter})

        const loginLink = screen.queryByText('Login')
        const signUpLink = screen.queryByText('Sign Up')
        const logOutLink = screen.queryByText('Log Out')

        expect(loginLink).toHaveAttribute('href','/login')
        expect(signUpLink).toHaveAttribute('href','/signup')
        expect(logOutLink).toBe(null)

    })

    test('when logged in, header must have link Log Out that call logout function and redirects to login', () =>{
        Cookies.set('authToken', 'testValues')
        
        render(
            <SessionProvider>
                <CookiesProvider>
                    <Header/>
                </CookiesProvider>
            </SessionProvider>,
            {wrapper: MemoryRouter}
        )

        const loginLink = screen.queryByText('Login')
        const signUpLink = screen.queryByText('Sign Up')
        const logOutLink = screen.queryByText('Log Out')

        expect(loginLink).toBe(null)
        expect(signUpLink).toBe(null)
        expect(logOutLink).toHaveAttribute('href','/login')

    })

})