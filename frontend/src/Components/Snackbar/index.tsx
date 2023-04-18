import ReactChildren from "Common/Types/ReactChildren"
import SnackbarContainer from "./SnackbarContainer"

interface IPropsSnack {
    children: ReactChildren
    colorPallete?: 'success' | 'failure' | 'neutral'
}

function Snackbar({ children, colorPallete = 'neutral' }:IPropsSnack) {

    return (
            <SnackbarContainer colorPallete={colorPallete}>{children}</SnackbarContainer>
    )
}

export default Snackbar