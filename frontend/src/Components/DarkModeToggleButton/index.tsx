import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { useContext } from 'react'
import { PageThemeContext } from 'Common/Contexts/PageThemeContext'
import Label from 'Components/AtomComponents/Label'
import styles from './ToggleButton.module.css'
import ToggleButtonContainer from './ToggleButtonContainer'

//toggle switch to turn dark mode on and off
function DarkModeToggleButton() {
    const { pageTheme, toggleDarkMode } = useContext(PageThemeContext)

    return (
        <ToggleButtonContainer>
            <Label id='toggle'>Dark Mode</Label>
            {pageTheme ? 
                <BsToggleOn 
                    onClick={toggleDarkMode}
                    className={styles.toggleButton}
                    aria-labelledby='toggle'
                /> : 
                <BsToggleOff 
                    onClick={toggleDarkMode} 
                    className={styles.toggleButton}
                    aria-labelledby='toggle'
                />
            }
            
        </ToggleButtonContainer>
    )
}

export default DarkModeToggleButton