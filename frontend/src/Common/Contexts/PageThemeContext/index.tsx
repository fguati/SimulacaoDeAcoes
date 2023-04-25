import { ReactChildren } from "Common/Types";
import { createContext, useState } from "react";

interface IPageContextValues {
    pageTheme: string
    setPageTheme: React.Dispatch<React.SetStateAction<string>>
    toggleDarkMode: () => void
}

export const PageThemeContext = createContext<IPageContextValues>(undefined!)

PageThemeContext.displayName = 'PageThemeContext'

export function PageThemeContextProvider({children}: {children: ReactChildren}) {

    const [pageTheme, setPageTheme] = useState('')

    function toggleDarkMode() {
        setPageTheme(formerTheme => formerTheme ? '' : 'darkMode')
    }

    return (
        <PageThemeContext.Provider value={{pageTheme, setPageTheme, toggleDarkMode }}>
            {children}
        </PageThemeContext.Provider>
    )
}
