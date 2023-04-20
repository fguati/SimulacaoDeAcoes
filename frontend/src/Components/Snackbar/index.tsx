import SnackbarContainer from "./SnackbarContainer"
import { useContext, useEffect } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext"

//Snackbar component that is rendered in the bottom of the screen to give messages
function Snackbar() {
    //get all the global state information and functions from the snackbar context
    const { active, deactivateSnackbar, snackBarPosition, colorPalette, snackbarMessage } = useContext(SnackbarContext)
    
    //the snackbar must leave the screen after a small interval
    useEffect(() => {
        if(active) {
            setTimeout(() => {
                deactivateSnackbar()
            }, 3000)
        }
    }, [active, deactivateSnackbar])

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