import { BoxColorPalette, ISnackPosition } from "Common/Types/"

//Props received by the snackbar container to determine its position in the view and color palette
interface IProps {
    colorPalette: BoxColorPalette
    position: ISnackPosition
}

export default IProps