import { createContext, useCallback } from 'react'
import { ISnackPosition, BoxColorPalette } from 'Common/Types/'
import { botScrnSnckBrPosition, outScrnSnckBrPosition, transitionTime } from 'Common/Constants'
import useSnackbarState from './useSnackbarStates'
import { IActivateOptions, IProps } from './interfaces'

//Interface for the context to be created
export interface ISnackbarContext {
    active: boolean
    deactivateSnackbar: () => void
    activateSnackbar: (message:string, options?:IActivateOptions) => void
    snackBarPosition: ISnackPosition
    colorPalette: BoxColorPalette
    snackbarMessage: string
    overwriteDeactivationTimer: (timerID: NodeJS.Timeout | null) => void
}

//Create context that will be responsible for handling the snackbar so be rendered and manipulated from anywhere in the app
const SnackbarContext = createContext<ISnackbarContext>(undefined!)

SnackbarContext.displayName = 'Snackbar Context'

//Context provider for the snackbar context
const SnackbarProvider = ({ children }: IProps) => {
    //create all snackbar states
    const {
        active, setActive,
        snackBarPosition, setSnackbarPosition,
        snackbarMessage, setSnackbarMessage,
        colorPalette, setColorPalette,
        setDeactivationTimerID
    } = useSnackbarState()

    //function responsible for overwriting the deactivation timer by first clearing the old one and then setting the new
    const overwriteDeactivationTimer = useCallback((timerID: NodeJS.Timeout | null): void => {
        setDeactivationTimerID(oldTimer => {
            if(oldTimer){
                clearTimeout(oldTimer)
            }
            return timerID
        })
    },[setDeactivationTimerID])

    // Function responsible for unmounting the snackbar
    const deactivateSnackbar = useCallback(() => {
        // position the snackbar out of the screen for a better visual effect
        setSnackbarPosition(outScrnSnckBrPosition)
        
        //unmount the snackbar, waiting enough time for the transition animation to complete
        const timerID = setTimeout(() => {
            setActive(false)
        }, transitionTime)

        //overwrite deactivation timer ID so future snackbars are not mistakenly dismounted
        overwriteDeactivationTimer(timerID)
    }, [overwriteDeactivationTimer, setActive, setSnackbarPosition])

    //Function responsible for rendering snackbar
    const activateSnackbar = useCallback((message:string, options?:IActivateOptions) => {
        //Zero the deactivation timer so this snackbar is not mistakenly dismounted
        overwriteDeactivationTimer(null)

        //setting default color pallete to neutral
        let desiredPalette:BoxColorPalette ='neutral'
        if(options && options.colorPalette) {
            desiredPalette = options.colorPalette
        }
        //Render the snackbar
        setActive(true)
        //Render the snackbar message
        setSnackbarMessage(message)
        //Change the snackbar to the color palette entered as argument
        setColorPalette(desiredPalette)
        // Move the snackbar into view, giving it enough time for the transition animation to complete
        setTimeout(() => {
            setSnackbarPosition(botScrnSnckBrPosition)
        }, transitionTime / 5)

    }, [overwriteDeactivationTimer, setActive, setColorPalette, setSnackbarMessage, setSnackbarPosition])

    return (
        <SnackbarContext.Provider value={{ active, deactivateSnackbar, activateSnackbar, snackBarPosition, snackbarMessage, colorPalette, overwriteDeactivationTimer }}>
            {children}
        </SnackbarContext.Provider>
    )
}

export { SnackbarContext, SnackbarProvider }