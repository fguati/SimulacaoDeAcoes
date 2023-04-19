import ReactChildren from "Common/Types/ReactChildren"
import SnackbarContainer from "./SnackbarContainer"
import { useContext, useEffect } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext"

interface IPropsSnack {
    children: ReactChildren
}

//Snackbar component that is rendered in the bottom of the screen to give messages
function Snackbar({ children }:IPropsSnack) {
    //get all the global state information and functions from the snackbar context
    const { active, deactivateSnackbar, snackBarPosition, colorPalette } = useContext(SnackbarContext)
    
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
                    {children}
                </SnackbarContainer>
            }
        </>
    )
}

export default Snackbar