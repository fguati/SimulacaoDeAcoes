import SnackbarContainer from "./SnackbarContainer"
import { useContext } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext"

//Snackbar component that is rendered in the bottom of the screen to give messages. This component is manipulated through the SnackbarContext
function Snackbar() {
    //get all the global state information and functions from the snackbar context
    const { active, deactivateSnackbar, snackBarPosition, colorPalette, snackbarMessage } = useContext(SnackbarContext)
    
    return (
        <>
            {active && 
                <SnackbarContainer
                    position={snackBarPosition}
                    onClick={() => deactivateSnackbar()}
                    colorPalette={colorPalette}
                >
                    {snackbarMessage}
                </SnackbarContainer>
            }
        </>
    )
}

export default Snackbar