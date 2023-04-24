import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Snackbar from ".."
import { ISnackPosition, ReactChildren, BoxColorPalette } from "Common/Types/"
import '@testing-library/jest-dom'
import 'styles/_variables.css'
import { ISnackbarContext, SnackbarContext, SnackbarProvider } from "Common/Contexts/SnackbarContext"
import { botScrnSnckBrPosition, outScrnSnckBrPosition, transitionTime } from 'Common/Constants'
import { useContext } from "react"
import { act } from "react-dom/test-utils"

jest.mock('../SnackbarContainer', () => ({ children, colorPalette, position, onClick }: { children: ReactChildren, colorPalette: BoxColorPalette, position:ISnackPosition, onClick: React.MouseEventHandler<HTMLDivElement> | undefined }) => {
    return(
        <div onClick={onClick} data-testid ={'snackbar'}>
            {children}
            <p>{colorPalette}</p>
            <p>{position}</p>
        </div>
    )
})

describe('Unit tests of the behavior of the Snackbar component', () => {
    jest.useFakeTimers()
    const mockedSnackbarContext: ISnackbarContext = {
        active: false, 
        deactivateSnackbar: jest.fn(),
        activateSnackbar: jest.fn(),
        snackBarPosition: outScrnSnckBrPosition, 
        colorPalette: 'neutral',
        snackbarMessage: 'Mocked message',
        overwriteDeactivationTimer: jest.fn()
    }

    function renderSnackBar() {
        cleanup()
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <Snackbar/>
            </SnackbarContext.Provider>
        )
    }

    it('only renders if the active state provided by its context is true', () => {
        renderSnackBar()
        
        let $snackbar = screen.queryByText(mockedSnackbarContext.snackbarMessage)
        expect($snackbar).not.toBeInTheDocument()
        
        mockedSnackbarContext.active = true
        renderSnackBar()
        $snackbar = screen.queryByText(mockedSnackbarContext.snackbarMessage)
        expect($snackbar).toBeInTheDocument()

    })

    it('must render with props and onclick provided by its context', () => {
        renderSnackBar()

        let $position = screen.queryByText(mockedSnackbarContext.snackBarPosition)
        let $colorPallete = screen.queryByText(mockedSnackbarContext.colorPalette)
        expect($position).toBeInTheDocument()
        expect($colorPallete).toBeInTheDocument()
    })

    it('must call the deactivateSnackbar funtcion if active state is true or when snackbar is clicked', () => {
        renderSnackBar()
        const $snackbar = screen.queryByText(mockedSnackbarContext.snackbarMessage)
        fireEvent.click($snackbar!)
        expect(mockedSnackbarContext.deactivateSnackbar).toBeCalled()
    })

    it('must call deactivateSnackbar after a short interval if snackbar is active', () => {
        mockedSnackbarContext.active = true
        renderSnackBar()
        act(() => {
            jest.runAllTimers()
        })

        expect(mockedSnackbarContext.deactivateSnackbar).toBeCalled()
    })

})

describe('Integration tests between snackbar component and its context', () => {
    jest.useFakeTimers()
    const neutralMessage = 'standard message'
    const failMessage = 'fail message'
    const successMessage = 'succeded message'
    
    function ContextCallerComponent() {
        const { activateSnackbar, deactivateSnackbar} = useContext(SnackbarContext)

        return(
            <>
                <button onClick={() => activateSnackbar!(failMessage, {colorPalette: "failure"})}>{failMessage + 'button'}</button>
                <button onClick={() => activateSnackbar!(neutralMessage, {colorPalette: "neutral"})}>{neutralMessage + 'button'}</button>
                <button onClick={() => activateSnackbar!(successMessage, {colorPalette: "success"})}>{successMessage + 'button'}</button>
                <button onClick={() => deactivateSnackbar!()}>deactivate</button>
            </>
        )
    }
    
    function renderSnackBar() {
        cleanup()
        render(
            <SnackbarProvider>
                <Snackbar/>
                <ContextCallerComponent/>
            </SnackbarProvider>
        )
    }
    
    it('must not render snackbar without changing snackbar active state', () => {
        renderSnackBar()
        const $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).not.toBeInTheDocument()

    })

    test('snackbar must be rendered after activate snackbar function is called, and its properties must be the ones entered as args', () => {
        function testActivate(message:string, color:BoxColorPalette) {
            const $testButton = screen.getByText(message + 'button')
            fireEvent.click($testButton)
            act(() => jest.advanceTimersToNextTimer())
            const $colorSpy = screen.getByText(color)
            expect($colorSpy).toBeInTheDocument()
            const $messageSpy = screen.getByText(message)
            expect($messageSpy).toBeInTheDocument()
        }

        renderSnackBar()

        testActivate(failMessage, 'failure')
        act(() => jest.runAllTimers())

        testActivate(neutralMessage, 'neutral')
        act(() => jest.runAllTimers())

        testActivate(successMessage, 'success')

        const $snackbar = screen.getByTestId('snackbar')
        expect($snackbar).toBeInTheDocument()
        const $positionSpy = screen.getByText(botScrnSnckBrPosition)
        expect($positionSpy).toBeInTheDocument()

    })

    test('snackbar must be unmounted after snackbar component is clicked', () => {
        renderSnackBar()
        let $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).not.toBeInTheDocument()

        const $activateButton = screen.getAllByText('button', { exact:false })
        fireEvent.click($activateButton[0])
        
        $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).toBeInTheDocument()

        const $deactivateButton = screen.getByText('deactivate')
        fireEvent.click($deactivateButton)
        act(() => jest.advanceTimersByTime(transitionTime + 1))
        $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).not.toBeInTheDocument()

    })

    test('snackbar must be unmounted after a short interval', () => {
        renderSnackBar()
        let $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).not.toBeInTheDocument()

        const $activateButton = screen.getAllByText('button', { exact:false })
        fireEvent.click($activateButton[0])
        
        $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).toBeInTheDocument()

        act(() => jest.runAllTimers())
        $snackbar = screen.queryByTestId('snackbar')
        expect($snackbar).not.toBeInTheDocument()
    })

})