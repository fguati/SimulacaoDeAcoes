import { createContext } from 'react'
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
        colorPalette, setColorPalette
    } = useSnackbarState()

    // Function responsible for unmounting the snackbar
    function deactivateSnackbar() {
        // position the snackbar out of the screen for a better visual effect
        setSnackbarPosition(outScrnSnckBrPosition)
        
        //unmount the snackbar, waiting enough time for the transition animation to complete
        setTimeout(() => {
            setActive(false)
        }, transitionTime)
    }

    //Function responsible for rendering snackbar
    function activateSnackbar(message:string, options?:IActivateOptions) {
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

    }

    return (
        <SnackbarContext.Provider value={{ active, deactivateSnackbar, activateSnackbar, snackBarPosition, snackbarMessage, colorPalette }}>
            {children}
        </SnackbarContext.Provider>
    )
}

export { SnackbarContext, SnackbarProvider }