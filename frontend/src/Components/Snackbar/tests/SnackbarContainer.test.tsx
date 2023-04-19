import { render, screen } from "@testing-library/react"
import SnackbarContainer from "../SnackbarContainer"
import 'styles/_variables.css'
import '@testing-library/jest-dom'
import ISnackPosition from "Common/Types/ISnackPosition"

describe('Test the rendering of the snackbar container', () => {
    test('position on the screen must be defined by props', () => {
        const testPosition: ISnackPosition = '-5vh'
        
        render(<SnackbarContainer
            colorPalette="neutral"
            position={testPosition}
        >test</SnackbarContainer>)
        
        const $container = screen.getByText('test')
        const style = window.getComputedStyle($container)
        expect(style.transform).toBe(`translateY(${testPosition})`)
    })
})