import IProps from "./IProps"

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

const snackThemeSelector = ({colorPallete}:IProps, property: 'background' | 'line') => {
    return `var(${themes[colorPallete][property]})`
}

export default snackThemeSelector