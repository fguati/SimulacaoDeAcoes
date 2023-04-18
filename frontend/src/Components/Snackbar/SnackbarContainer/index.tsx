import styled from "styled-components";
import IProps from "./IProps";
import snackThemeSelector from "./snackThemeSelector";

const SnackbarContainer = styled.div`
    z-index: 2;
    position: absolute;
    transform: translateY(-6vh);
    
    padding: var(--default-spacing);
    background-color: ${({colorPallete}:IProps) => snackThemeSelector({colorPallete}, 'background')};
    box-sizing: border-box;
    width: 100%;
    height: 4vh;
    
    border: 2px solid ${({colorPallete}:IProps) => snackThemeSelector({colorPallete}, 'line')};
    border-radius: 5px;

    text-align: center;
    color: ${({colorPallete}:IProps) => snackThemeSelector({colorPallete}, 'line')};
    display: flex;
    align-items: center;
    justify-content: center;
    
`

export default SnackbarContainer