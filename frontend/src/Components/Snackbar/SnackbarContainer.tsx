import styled from "styled-components";

interface IProps {
    colorPallete: 'success' | 'failure' | 'neutral'
}

const themes = {
    success: {
        background: '--success-light' ,
        line: '--success-dark'
    },
    failure: {
        background: '--failure-light' ,
        line: '--failure-dark'
    },
    neutral: {
        background: '--background-light',
        line: '--dark-font-color'
    }
}

const snackTheme = ({colorPallete}:IProps, property: 'background' | 'line') => {
    return `var(${themes[colorPallete][property]})`
} 

const SnackbarContainer = styled.div`
    z-index: 2;
    position: absolute;
    transform: translateY(-6vh);
    
    padding: var(--default-spacing);
    background-color: ${({colorPallete}:IProps) => snackTheme({colorPallete}, 'background')};
    box-sizing: border-box;
    width: 100%;
    height: 4vh;
    
    border: 2px solid ${({colorPallete}:IProps) => snackTheme({colorPallete}, 'line')};
    border-radius: 5px;

    text-align: center;
    color: ${({colorPallete}:IProps) => snackTheme({colorPallete}, 'line')};
    display: flex;
    align-items: center;
    justify-content: center;
    
`

export default SnackbarContainer