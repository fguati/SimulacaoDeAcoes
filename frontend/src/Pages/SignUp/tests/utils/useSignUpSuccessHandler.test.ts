import useSignUpSuccessHandler from "Pages/SignUp/utils/useSignUpSuccessHandler"
import { useNavigate } from "react-router-dom";

jest.mock('react-router-dom', () => {
    const originalMod = jest.requireActual('react-router-dom')

    return ({
        __esModule: true,
        ...originalMod,
        useNavigate: jest.fn()
    })
})

describe('test the success handler custom hooke for the sign up page', () => {
    const mockNavigate = jest.fn();
    const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
    global.alert = jest.fn();

    test('calls the useNavigate hook', () => {
        useSignUpSuccessHandler();
        expect(mockedUseNavigate).toBeCalled()
    })

    test('calls navigate funcion with /login route', async () => {
        mockedUseNavigate.mockReturnValue(mockNavigate);
        const mockResponse = new Response("Success!", { status: 200 });

        const signUpSuccessHandler = useSignUpSuccessHandler();
        signUpSuccessHandler(mockResponse)
        expect(mockNavigate).toBeCalledWith('/login')

    })
})