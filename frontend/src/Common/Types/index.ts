import { botScrnSnckBrPosition, outScrnSnckBrPosition } from "Common/Constants"
import { type } from "os";
import { ReactElement } from "react";

//Type for the children prop of any component
export type ReactChildren = ReactElement | string | Array<ReactElement | string>

//positions the snackbar can ocupy in the screen
export type ISnackPosition = typeof botScrnSnckBrPosition | typeof outScrnSnckBrPosition

//type that define all the possible backend routes
export type BackendRoutes = '/login' | '/register' | '/user' | '/user/deposit' | '/user/portfolio' | '/user/balance' | '/user/trade' | 'user/history'

//Type that restricts the basic collor palette of a box
export type BoxColorPalette = 'success' | 'failure' | 'neutral'

//Type that defines used currencies
export type currency = 'BRL' | 'USD'

//Input types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'dropdown'

//Viewport sizes
export type viewportSizes = '768px' | '425px' | '375px' | '320px'

//Element that is hidden at certain viewport width
export interface IHideableElement {
    hideOn?: viewportSizes
    element?: ReactChildren
    width?: number
}

export type spacingVariables = '--font-based-spacing' | '--small-spacing' | '--default-spacing' | '--medium-spacing' | '--large-spacing' | '--xl-spacing'

export type fontSizeVariables = '--xxl-font-size' | '--xl-font-size' | '--large-font-size' | '--medium-font-size' | '--default-font-size'