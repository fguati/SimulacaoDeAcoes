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
    const [snackbarMessage, setSnackbarMessage] = useState('')
    //state determining the color palette
    const [colorPalette, setColorPalette] = useState<BoxColorPalette>('neutral')

    return {
        active, setActive,
        snackBarPosition, setSnackbarPosition,
        snackbarMessage, setSnackbarMessage,
        colorPalette, setColorPalette
    }
}

export default useSnackbarState
