import styled from "styled-components";
import IProps from "./IProps";
import { transitionTime } from "Common/Constants";
import { BoxColorPalette } from "Common/Types/";
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
    padding: var(--font-based-spacing);
    
    //box style
    background-color: ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'background')};
    box-sizing: border-box;
    width: 100%;
    /* height: 4vh; */
    
    //border style
    border: 2px solid ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'line')};
    border-radius: 5px;

    //text style
    line-height: 100%;
    text-align: center;
    color: ${({colorPalette}:IProps) => snackThemeSelector(colorPalette, 'line')};
    display: flex;
    align-items: center;
    justify-content: center;

    //interactive style
    cursor: pointer;
    transition: ${transitionTime}ms;

    @media screen and (min-width: 768px) {
        font-size: var(--medium-font-size);
    }

    @media screen and (min-width: 768px) {
        font-size: var(--large-font-size);
    }
    
`

export default SnackbarContainer