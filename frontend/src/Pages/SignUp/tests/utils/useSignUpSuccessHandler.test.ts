import useSignUpSuccessHandler from "Pages/SignUp/utils/useSignUpSuccessHandler"
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { ISnackbarContext } from "Common/Contexts/SnackbarContext";
import { botScrnSnckBrPosition } from "Common/Constants";
import IServerResponse from "Interfaces/IServerResponse";

jest.mock('react-router-dom', () => {
    const originalMod = jest.requireActual('react-router-dom')

    return ({
        __esModule: true,
        ...originalMod,
        useNavigate: jest.fn()
    })
})

jest.mock('react', () => {
    const originalMod = jest.requireActual('react')

    return {
        ...originalMod,
        useContext: jest.fn()
    }
})

describe('test the success handler custom hooke for the sign up page', () => {
    const mockNavigate = jest.fn();
    const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
    const mockedState: ISnackbarContext = {
        activateSnackbar:jest.fn(),
        active: true,
        colorPalette:'neutral',
        deactivateSnackbar: jest.fn(),
        snackbarMessage:'Placeholder',
        snackBarPosition: botScrnSnckBrPosition,
        overwriteDeactivationTimer: jest.fn()
    }
    const mockUseContext = useContext as jest.MockedFunction<typeof useContext>

    const mockResponse: IServerResponse<unknown> = {
        code: 200,
        ok: true
    }

    beforeEach(() => {
        mockUseContext.mockReturnValue(mockedState)
        mockedUseNavigate.mockReturnValue(mockNavigate);
    })

    test('calls the useNavigate hook', () => {
        useSignUpSuccessHandler();
        expect(mockedUseNavigate).toBeCalled()
    })

    test('calls navigate funcion with /login route', async () => {
        const signUpSuccessHandler = useSignUpSuccessHandler();
        signUpSuccessHandler(mockResponse)
        expect(mockNavigate).toBeCalledWith('/login')

    })

    test('must call the activate snackbar', () => {
        const signUpSuccessHandler = useSignUpSuccessHandler();
        signUpSuccessHandler(mockResponse)
        expect(mockedState.activateSnackbar).toBeCalledWith(expect.stringContaining('success') , {colorPalette: 'success'})
    })
})