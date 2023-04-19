import ReactChildren from 'Common/Types/ReactChildren'
import { createContext, useState } from 'react'
import ISnackPosition, { BottomOfScreenPos, OutOfScreenPos } from './ISnackPosition'
import { transitionTime } from 'Common/Constants'
import { ColorPallete } from 'Components/Snackbar/SnackbarContainer/IProps'

interface IProps {
    children: ReactChildren
}

interface ISnack {
    active?: boolean
    deactivateSnackbar?: () => void
    activateSnackbar?: (pallete?: ColorPallete) => void
    snackBarPosition?: ISnackPosition
    colorPallete?: ColorPallete
}

const SnackbarContext = createContext<ISnack>({})

const SnackbarProvider = ({ children }: IProps) => {
    const [active, setActive] = useState(false)
    const [snackBarPosition, setSnackbarPosition] = useState<ISnackPosition>(OutOfScreenPos)
    const [colorPallete, setColorPallete] = useState<ColorPallete>('neutral')

    function deactivateSnackbar() {
        setSnackbarPosition(OutOfScreenPos)
        setTimeout(() => {
            setActive(false)
        }, transitionTime)
    }

    function activateSnackbar(desiredPallete: ColorPallete = 'neutral') {
        setActive(true)
        setColorPallete(desiredPallete)
        setTimeout(() => {
            setSnackbarPosition(BottomOfScreenPos)
        }, transitionTime / 5)
    }

    return (
        <SnackbarContext.Provider value={{ active, deactivateSnackbar, activateSnackbar, snackBarPosition, colorPallete }}>
            {children}
        </SnackbarContext.Provider>
    )
}

export { SnackbarContext, SnackbarProvider }