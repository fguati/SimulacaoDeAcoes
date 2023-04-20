import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Snackbar from ".."
import { ISnackPosition, ReactChildren, BoxColorPalette } from "Common/Types/"
import '@testing-library/jest-dom'
import 'styles/_variables.css'
import { ISnackbarContext, SnackbarContext } from "Common/Contexts/SnackbarContext"
import { outScrnSnckBrPosition } from 'Common/Constants'

jest.mock('../SnackbarContainer', () => ({ children, colorPalette, position, onClick }: {children: ReactChildren, colorPalette: BoxColorPalette, position:ISnackPosition, onClick: React.MouseEventHandler<HTMLDivElement> | undefined }) => {
    return(
        <div onClick={onClick}>
            {children}
            <p>{colorPalette}</p>
            <p>{position}</p>
        </div>
    )
})

describe('Tests the behavior of the Snackbar component', () => {
    const mockedSnackbarContext: ISnackbarContext = {
        active: false, 
        deactivateSnackbar: jest.fn(),
        activateSnackbar: jest.fn(),
        snackBarPosition: outScrnSnckBrPosition, 
        colorPalette: 'neutral',
        snackbarMessage: 'Mocked message'
    }

    function renderSnackBar() {
        cleanup()
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <Snackbar>test</Snackbar>
            </SnackbarContext.Provider>
        )
    }

    it('only renders if the active state provided by its context is true', () => {
        renderSnackBar()
        
        let $snackbar = screen.queryByText('test')
        expect($snackbar).not.toBeInTheDocument()
        
        mockedSnackbarContext.active = true
        renderSnackBar()
        $snackbar = screen.queryByText('test')
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
        const $snackbar = screen.queryByText('test')
        fireEvent.click($snackbar!)
        expect(mockedSnackbarContext.deactivateSnackbar).toBeCalled()

    })


})