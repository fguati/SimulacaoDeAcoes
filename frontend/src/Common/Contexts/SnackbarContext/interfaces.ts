import { BoxColorPalette, ReactChildren } from "Common/Types"

//Props interface for the context provider
export interface IProps {
    children: ReactChildren
}

// Interface for the options entered in the activate snackbar function defined below in the code
export interface IActivateOptions {
    colorPalette?: BoxColorPalette
}