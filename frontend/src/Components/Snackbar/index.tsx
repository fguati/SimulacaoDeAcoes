import SnackbarContainer from "./SnackbarContainer"
import { useContext, useEffect } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext"
import { transitionTime } from "Common/Constants"

//Snackbar component that is rendered in the bottom of the screen to give messages. This component is manipulated through the SnackbarContext
function Snackbar() {
    //get all the global state information and functions from the snackbar context
    const { active, deactivateSnackbar, snackBarPosition, colorPalette, snackbarMessage, overwriteDeactivationTimer } = useContext(SnackbarContext)
    
    //the snackbar must leave the screen after a small interval
    useEffect(() => {
        if(active) {
            const timerID = setTimeout(() => {
                deactivateSnackbar()
            }, transitionTime * 2)

            //Overwrite deactivation timer so the timer can be cleared by other snackbar calls if needed
            overwriteDeactivationTimer(timerID)
        }
        //snackBarMessage must be a dependency so the deactivation timer gets reset if to snackbar call are done in quick succession
    }, [active, overwriteDeactivationTimer, deactivateSnackbar, snackbarMessage])
    
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