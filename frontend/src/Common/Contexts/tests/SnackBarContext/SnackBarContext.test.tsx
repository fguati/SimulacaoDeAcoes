import { fireEvent, render, screen } from "@testing-library/react"
import { SnackbarContext, SnackbarProvider } from "Common/Contexts/SnackbarContext"
import { useContext } from 'react'
import '@testing-library/jest-dom'
import { BottomOfScreenPos, OutOfScreenPos } from "Common/Contexts/SnackbarContext/ISnackPosition"
import { act } from "react-dom/test-utils"
import { ColorPallete } from "Components/Snackbar/SnackbarContainer/IProps"

describe('Test snackbar context module', () => {
    jest.useFakeTimers();

    function ExampleComponent() {
        const {
            active, 
            deactivateSnackbar, 
            activateSnackbar, 
            snackBarPosition, 
            colorPallete
        } = useContext(SnackbarContext)

        return(
            <>
                <div>{String(active)}</div>
                <div>{snackBarPosition}</div>
                <div>{colorPallete}</div>
                <button onClick={() => activateSnackbar!("failure")}>activate failure</button>
                <button onClick={() => activateSnackbar!("neutral")}>activate neutral</button>
                <button onClick={() => activateSnackbar!("success")}>activate success</button>
                <button onClick={() => deactivateSnackbar!()}>deactivate</button>
            </>
        )
    }

    function renderExampleComponent() {
        render(<SnackbarProvider>
            <ExampleComponent/>
        </SnackbarProvider>)
    }

    it('must provide the active, snackBarPosition and colorPallete states with default values false, out of screen and neutral, respectively', () => {
        renderExampleComponent()
        const $active = screen.getByText('false')
        const $position = screen.getByText(OutOfScreenPos)
        const $pallete = screen.getByText('neutral')

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()
        expect($pallete).toBeInTheDocument()

    })

    it('must provide the activateSnackbar function that changes all the provided states', () => {
        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            renderExampleComponent()
        })

        let $pallete = screen.getByText('neutral')

        function testActivateButton(testButton: HTMLElement, pallete: ColorPallete) {
            fireEvent.click(testButton)
            act(() => {
                jest.runAllTimers()
            })
            $pallete = screen.getByText(pallete)
            expect($pallete).toBeInTheDocument()

        }

        const $failureButton = screen.getByText('activate failure')
        const $neutralButton = screen.getByText('activate neutral')
        const $successButton = screen.getByText('activate success')

        testActivateButton($failureButton, 'failure')
        let $active = screen.getByText('true')
        let $position = screen.getByText(BottomOfScreenPos)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

        testActivateButton($neutralButton, 'neutral')
        testActivateButton($successButton, 'success')
    })

    it('must provide the deactivateSnackbar function that changes all the provided states', () => {
        renderExampleComponent()
        const $deactivate = screen.getByText('deactivate')
        const $failureButton = screen.getByText('activate failure')

        fireEvent.click($failureButton)
        act(() => {
            jest.runAllTimers()
        })

        let $active = screen.getByText('true')
        let $position = screen.getByText(BottomOfScreenPos)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

        fireEvent.click($deactivate)
        act(() => {
            jest.runAllTimers()
        })

        $active = screen.getByText('false')
        $position = screen.getByText(OutOfScreenPos)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

    })

})