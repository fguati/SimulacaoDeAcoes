import { BoxColorPalette } from "Common/Types/ColorPalletes"
import ISnackPosition from "Common/Types/ISnackPosition"

//Props received by the snackbar container to determine its position in the view and color palette
interface IProps {
    colorPalette: BoxColorPalette
    position: ISnackPosition
}

export default IProps