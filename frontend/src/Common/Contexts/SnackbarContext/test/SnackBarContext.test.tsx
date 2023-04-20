import { fireEvent, render, screen } from "@testing-library/react"
import { SnackbarContext, SnackbarProvider } from "Common/Contexts/SnackbarContext"
import { useContext } from 'react'
import '@testing-library/jest-dom'
import { act } from "react-dom/test-utils"
import { botScrnSnckBrPosition, outScrnSnckBrPosition } from 'Common/Constants'
import { BoxColorPalette } from "Common/Types/"

describe('Test snackbar context module', () => {
    jest.useFakeTimers();

    function ExampleComponent() {
        const {
            active, 
            deactivateSnackbar, 
            activateSnackbar, 
            snackBarPosition, 
            colorPalette,
            snackbarMessage
        } = useContext(SnackbarContext)

        return(
            <>
                <div>{String(active)}</div>
                <div>{snackBarPosition}</div>
                <div>{colorPalette}</div>
                <div>{snackbarMessage}</div>
                <button onClick={() => activateSnackbar!('fail message', {colorPalette: "failure"})}>activate failure</button>
                <button onClick={() => activateSnackbar!('other message', {colorPalette: "neutral"})}>activate neutral</button>
                <button onClick={() => activateSnackbar!('succeded message', {colorPalette: "success"})}>activate success</button>
                <button onClick={() => deactivateSnackbar!()}>deactivate</button>
            </>
        )
    }

    function renderExampleComponent() {
        render(<SnackbarProvider>
            <ExampleComponent/>
        </SnackbarProvider>)
    }

    it('must provide the active, snackBarPosition, snackbarMessage and colorPallete states with default values false, out of screen and neutral, respectively', () => {
        renderExampleComponent()
        const $active = screen.getByText('false')
        const $position = screen.getByText(outScrnSnckBrPosition)
        const $pallete = screen.getByText('neutral')
        const $message = screen.getByText('Placeholder', {exact:false})

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()
        expect($pallete).toBeInTheDocument()
        expect($message).toBeInTheDocument()

    })

    it('must provide the activateSnackbar function that changes all the provided states', () => {
        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            renderExampleComponent()
        })

        let $pallete = screen.getByText('neutral')
        let $message = screen.getByText('Placeholder', {exact:false})

        function testActivateButton(testButton: HTMLElement, message:string, pallete: BoxColorPalette) {
            fireEvent.click(testButton)
            act(() => {
                jest.runAllTimers()
            })
            $pallete = screen.getByText(pallete)
            expect($pallete).toBeInTheDocument()
            $message = screen.getByText(message)
            expect($message).toBeInTheDocument()

        }

        const $failureButton = screen.getByText('activate failure')
        const $neutralButton = screen.getByText('activate neutral')
        const $successButton = screen.getByText('activate success')

        testActivateButton($failureButton, 'fail message', 'failure')
        let $active = screen.getByText('true')
        let $position = screen.getByText(botScrnSnckBrPosition)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

        testActivateButton($neutralButton, 'other message', 'neutral')
        testActivateButton($successButton, 'succeded message', 'success')
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
        let $position = screen.getByText(botScrnSnckBrPosition)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

        fireEvent.click($deactivate)
        act(() => {
            jest.runAllTimers()
        })

        $active = screen.getByText('false')
        $position = screen.getByText(outScrnSnckBrPosition)

        expect($active).toBeInTheDocument()
        expect($position).toBeInTheDocument()

    })


})