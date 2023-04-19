import styled from "styled-components";
import IProps from "./IProps";
import { transitionTime } from "Common/Constants";
import { BoxColorPalette } from "Common/Types/ColorPalletes";
import BoxColorThemes from "Common/BoxColorThemes";

//function to receive snackbar position from props
const snackPosition = ({ position }:IProps) => {
    return `translateY(${position})`
}

// function to receive snackbar colorPallete from props and return the color of the selected property
const snackThemeSelector = (colorPalette: BoxColorPalette, property: 'background' | 'line') => {
    return `var(${BoxColorThemes[colorPalette][property]})`
}

//Container that handle visual elements of the snackbar
const SnackbarContainer = styled.div`
    //position style
    z-index: 2;
    position: absolute;
    transform: ${snackPosition};
    
    //spacing style
    padding: var(--default-spacing);
    
    //box style
    background-color: ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'background')};
    box-sizing: border-box;
    width: 100%;
    height: 4vh;
    
    //border style
    border: 2px solid ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'line')};
    border-radius: 5px;

    //text style
    text-align: center;
    color: ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'line')};
    display: flex;
    align-items: center;
    justify-content: center;

    //interactive style
    cursor: pointer;
    transition: ${transitionTime}ms;
    
`

export default SnackbarContainer