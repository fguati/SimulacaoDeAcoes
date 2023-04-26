import { ReactChildren } from "Common/Types";
import { createContext, useState, useEffect } from "react";
import { PageTheme } from "./types";

//Key of the local storage object that 
const storageThemePreferenceKey = 'themePreference'

//Interface of values and methods provided by the page theme context
interface IPageContextValues {
    pageTheme: PageTheme
    setPageTheme: React.Dispatch<React.SetStateAction<PageTheme>>
    toggleDarkMode: () => void
}

//create context that will handle the color theme of the page
export const PageThemeContext = createContext<IPageContextValues>(undefined!)
PageThemeContext.displayName = 'PageThemeContext'

//custom context provider
export function PageThemeContextProvider({children}: {children: ReactChildren}) {
    //state that manages the color themes for the page
    const [pageTheme, setPageTheme] = useState<PageTheme>('')

    //checking if there is a theme preference stored locally and using it
    useEffect(() => {
        const themePreference = localStorage.getItem(storageThemePreferenceKey) as PageTheme | null

        if(themePreference) {
            setPageTheme(themePreference)
        }
    }, [])

    //function that toggles dark mode on and off
    function toggleDarkMode() {
        setPageTheme(formerTheme => {
            if(formerTheme){
                localStorage.removeItem(storageThemePreferenceKey)
                return ''
            }
            
            localStorage.setItem(storageThemePreferenceKey, 'darkMode')
            return 'darkMode'
        })
    }

    return (
        <PageThemeContext.Provider value={{pageTheme, setPageTheme, toggleDarkMode }}>
            {children}
        </PageThemeContext.Provider>
    )
}
