import { ReactChildren } from "Common/Types";
import { createContext, useState } from "react";
import { PageTheme } from "./types";

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

    //function that toggles dark mode on and off
    function toggleDarkMode() {
        setPageTheme(formerTheme => formerTheme ? '' : 'darkMode')
    }

    return (
        <PageThemeContext.Provider value={{pageTheme, setPageTheme, toggleDarkMode }}>
            {children}
        </PageThemeContext.Provider>
    )
}
