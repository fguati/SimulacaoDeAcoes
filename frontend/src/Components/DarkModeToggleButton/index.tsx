import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { useContext } from 'react'
import { PageThemeContext } from 'Common/Contexts/PageThemeContext'
import Label from 'Components/AtomComponents/Label'

//toggle switch to turn dark mode on and off
function DarkModeToggleButton() {
    const { pageTheme, toggleDarkMode } = useContext(PageThemeContext)

    return (
        <>
            <Label id='toggle'>Dark Mode</Label>
            {pageTheme ? 
                <BsToggleOn onClick={toggleDarkMode} aria-labelledby='toggle'/> : 
                <BsToggleOff onClick={toggleDarkMode} aria-labelledby='toggle'/>}
            
        </>
    )
}

export default DarkModeToggleButton