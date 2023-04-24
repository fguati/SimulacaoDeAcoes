import { outScrnSnckBrPosition } from "Common/Constants"
import { BoxColorPalette, ISnackPosition } from "Common/Types/"
import { useState } from "react"

//Function that create all the needed states for the snackbar context
function useSnackbarState() {
    //state determining whether snackbar will be rendered or not
    const [active, setActive] = useState(false)
    //state determining where the snackbar will be in the screen
    const [snackBarPosition, setSnackbarPosition] = useState<ISnackPosition>(outScrnSnckBrPosition)
    //state determining the message to be shown in snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('Placeholder')
    //state determining the color palette
    const [colorPalette, setColorPalette] = useState<BoxColorPalette>('neutral')
    //state controlling the timer that counts down until snackbar deactivation
    const [deactivationTimerID, setDeactivationTimerID] = useState<NodeJS.Timeout | null>(null)

    return {
        active, setActive,
        snackBarPosition, setSnackbarPosition,
        snackbarMessage, setSnackbarMessage,
        colorPalette, setColorPalette,
        deactivationTimerID, setDeactivationTimerID
    }
}

export default useSnackbarState
