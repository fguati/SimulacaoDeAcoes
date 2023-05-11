import { botScrnSnckBrPosition, outScrnSnckBrPosition } from "Common/Constants"
import { ReactElement } from "react";

//Type for the children prop of any component
export type ReactChildren = ReactElement | string | Array<ReactElement | string>

//positions the snackbar can ocupy in the screen
export type ISnackPosition = typeof botScrnSnckBrPosition | typeof outScrnSnckBrPosition

//type that define all the possible backend routes
export type BackendRoutes = '/login' | '/register' | '/user' | '/user/deposit'

//Type that restricts the basic collor palette of a box
export type BoxColorPalette = 'success' | 'failure' | 'neutral'