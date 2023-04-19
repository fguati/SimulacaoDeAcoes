import ReactChildren from 'Common/Types/ReactChildren'
import { createContext, useState } from 'react'
import ISnackPosition from '../../Types/ISnackPosition'
import { transitionTime } from 'Common/Constants'
import { botScrnSnckBrPosition, outScrnSnckBrPosition } from 'Common/Constants'
import { BoxColorPalette } from 'Common/Types/ColorPalletes'

//Props interface for the context provider
interface IProps {
    children: ReactChildren
}

//Interface for the context to be created
export interface ISnackbarContext {
    active: boolean
    deactivateSnackbar: () => void
    activateSnackbar: (pallete?: BoxColorPalette) => void
    snackBarPosition: ISnackPosition
    colorPalette: BoxColorPalette
}

//Create context that will be responsible for handling the snackbar so be rendered and manipulated from anywhere in the app
const SnackbarContext = createContext<ISnackbarContext>(undefined!)

//Context provider for the snackbar context
const SnackbarProvider = ({ children }: IProps) => {
    //state determining whether snackbar will be rendered or not
    const [active, setActive] = useState(false)
    //state determining where the snackbar will be in the screen
    const [snackBarPosition, setSnackbarPosition] = useState<ISnackPosition>(outScrnSnckBrPosition)
    //state determining the color palette
    const [colorPalette, setColorPalette] = useState<BoxColorPalette>('neutral')

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
    function activateSnackbar(desiredPalette: BoxColorPalette = 'neutral') {
        //Render the snackbar
        setActive(true)
        //Change the snackbar to the color palette entered as argument
        setColorPalette(desiredPalette)
        // Move the snackbar into view, giving it enough time for the transition animation to complete
        setTimeout(() => {
            setSnackbarPosition(botScrnSnckBrPosition)
        }, transitionTime / 5)
    }

    return (
        <SnackbarContext.Provider value={{ active, deactivateSnackbar, activateSnackbar, snackBarPosition, colorPalette }}>
            {children}
        </SnackbarContext.Provider>
    )
}

export { SnackbarContext, SnackbarProvider }