import { PageThemeContext, PageThemeContextProvider } from "Common/Contexts/PageThemeContext"
import { fireEvent, render, screen } from "@testing-library/react"
import { PageTheme } from "Common/Contexts/PageThemeContext/types"
import { useContext } from "react"
import DarkModeToggleButton from "."

describe('Testing component responsible for toggling the Dark Mode theme', () => {
    interface IMockedPageContextValues {
        pageTheme: PageTheme
        setPageTheme: React.Dispatch<React.SetStateAction<PageTheme>>
        toggleDarkMode: () => void
    }
    
    const mockedToggleDarkMode = jest.fn()

    const mockedPageThemeContext: IMockedPageContextValues = {
        pageTheme: '',
        setPageTheme: jest.fn(),
        toggleDarkMode: mockedToggleDarkMode
    }
    
    const TestComponent = () => {
        const { pageTheme } = useContext(PageThemeContext)

        return (
            <p data-testid='pageTheme'>{pageTheme}</p>
        )
    }

    test('Unit test: must call the toggleDarkMode function when clicked', () => {
        render(<PageThemeContext.Provider value={mockedPageThemeContext}>
            <DarkModeToggleButton/>
            <TestComponent/>
        </PageThemeContext.Provider>)

        const $toggleButton = screen.getByLabelText('Dark Mode')
        fireEvent.click($toggleButton)
        expect(mockedToggleDarkMode).toBeCalled()

    })

    test('Integration test: must toggle between dark on and off mode when clicked', () => {
        render(<PageThemeContextProvider>
            <DarkModeToggleButton/>
            <TestComponent/>
        </PageThemeContextProvider>)
        
        const $pageTheme = screen.getByTestId('pageTheme')
        expect($pageTheme.textContent).not.toBe('darkMode')

        let $toggleButton = screen.getByLabelText('Dark Mode')
        fireEvent.click($toggleButton)
        expect($pageTheme.textContent).toBe('darkMode')

        $toggleButton = screen.getByLabelText('Dark Mode')
        fireEvent.click($toggleButton)
        expect($pageTheme.textContent).not.toBe('darkMode')
        
    })
    
})