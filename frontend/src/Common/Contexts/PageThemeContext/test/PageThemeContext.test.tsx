import { fireEvent, render, screen } from '@testing-library/react'
import {useContext} from 'react'
import { PageThemeContext, PageThemeContextProvider } from '..'

describe('Tests the context the determine the color theme of the page', () => {
    const localStorageMock = (function () {
        type Store = {[key: string]: string}
        let store: Store = {};
      
        return {
          getItem(key: string) {
            return store[key];
          },
      
          setItem(key: string, value: string) {
            store[key] = value;
          },
      
          clear() {
            store = {};
          },
      
          removeItem(key: string) {
            delete store[key];
          },
      
          getAll() {
            return store;
          },
        };
    })();
      
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    afterEach(() => {
        localStorage.clear()
    })
    
    const ExampleComponent = () => {
        const { pageTheme, toggleDarkMode } = useContext(PageThemeContext) 
        
        return (
            <>
                <p data-testid= 'pageTheme'>{pageTheme}</p>
                <button onClick={() => toggleDarkMode()}>toggleDarkMode</button>
            </>
        )
    }
    
    it('provides the theme state', () => {
        const pageTheme ='darkMode'
        const setPageTheme = jest.fn()
        const toggleDarkMode = jest.fn()
        
        render(
            <PageThemeContext.Provider value ={ {pageTheme, setPageTheme, toggleDarkMode} }>
                <ExampleComponent/>
            </PageThemeContext.Provider>
        )

        const $themeState = screen.getByTestId('pageTheme')
        expect($themeState.textContent).toBe(pageTheme)
    })

    it('provides the toggleDarkMode function that changes the theme to and from darkmode', () => {
        render(
            <PageThemeContextProvider>
                <ExampleComponent/>
            </PageThemeContextProvider>
        )

        const $themeState = screen.getByTestId('pageTheme')
        expect($themeState.textContent).toBe('')

        const $toggleDarkModeButton = screen.getByText('toggleDarkMode')
        fireEvent.click($toggleDarkModeButton)
        expect($themeState.textContent).toBe('darkMode')


    })

    test('toggleDarkMode function stores theme in the localStorage', () => {
        render(
            <PageThemeContextProvider>
                <ExampleComponent/>
            </PageThemeContextProvider>
        )
        
        expect(localStorage.getItem('themePreference')).toBe(undefined)
        
        const $toggleDarkModeButton = screen.getByText('toggleDarkMode')
        fireEvent.click($toggleDarkModeButton)
        expect(localStorage.getItem('themePreference')).toBe('darkMode')
        
    })

})