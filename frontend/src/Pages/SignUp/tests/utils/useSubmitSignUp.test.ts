import useSubmitSignUp from "Pages/SignUp/utils/useSubmitSignUp"
import useSignUpSuccessHandler from "Pages/SignUp/utils/useSignUpSuccessHandler"
import { postForm, useHandleRequestResponse } from "utils/BackendAPICommunication/"
import IFormField from "Interfaces/IFormField"

jest.mock('Pages/SignUp/utils/useSignUpSuccessHandler', () => jest.fn())
jest.mock('utils/BackendAPICommunication/', () => {

    return {
        postForm: jest.fn(),
        addProperties: jest.fn(),
        useHandleRequestResponse: jest.fn()
    }
})

describe('Unit tests for the useSubmitSignUp custom hook', () => {
    const mockedUseSuccessHandlerHook = useSignUpSuccessHandler as jest.MockedFunction<typeof useSignUpSuccessHandler>
    const mockedUseHandleRequestResponseHook = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
    const mockedPostForm = postForm as jest.MockedFunction<typeof postForm>

    const mockedSuccessHandlerFunction = jest.fn()
    const mockedResponseHandlerFunction = jest.fn()
    const mockedToTargetMethod = jest.fn()
    const mockedToRouteMethod = jest.fn()

    const mockedForm = {
        Username: {value: 'mockedUser'},
        "E-mail": {value: 'mockedEmail'},
        Password: {value: 'mockedPassword'}
    }
    const mockedResponse = new Response(JSON.stringify(mockedForm), { status: 200 });

    const mockeFields:IFormField[] = [
        {name: 'Username', type: 'text', value:mockedForm.Username.value, fieldProperty: 'username'},
        {name: 'E-mail', type:'email', value: mockedForm["E-mail"].value, fieldProperty: 'email'}, 
        {name: 'Password', type:'password', value:mockedForm.Password.value, fieldProperty: 'password'},
        {name: 'Confirm Password', type: 'password', value:mockedForm.Password.value}
    ] 
    
    beforeEach(() => {
        mockedUseSuccessHandlerHook.mockReturnValue(mockedSuccessHandlerFunction)

        mockedResponseHandlerFunction.mockImplementation((response) => Promise.resolve(response))
        mockedUseHandleRequestResponseHook.mockReturnValue(mockedResponseHandlerFunction)

        mockedToTargetMethod.mockReturnValue(mockedForm)

        mockedToRouteMethod.mockResolvedValue(mockedResponse)
        mockedPostForm.mockReturnValue({to: mockedToRouteMethod})
    })

    test('useSignUpSuccessHandler custom hook must be called', () => {
        useSubmitSignUp()
        expect(mockedUseSuccessHandlerHook).toBeCalled()
    })

    test('useHandleRequestResponse custom hook must be called with the function returned by the UseSignUpSuccessHandler hook', () => {       
        useSubmitSignUp()
        expect(mockedUseHandleRequestResponseHook).toBeCalledWith(mockedSuccessHandlerFunction)
    
    })

    test('postForm.to method must be called with /register route and user with the same properties as the target of the submit event', async () => {
        const submitFunction = useSubmitSignUp()
        await submitFunction(mockeFields)
        const mockedUser = {
            username: mockedForm.Username.value,
            email: mockedForm["E-mail"].value,
            password: mockedForm.Password.value
        }
        expect(mockedPostForm).toBeCalledWith(mockedUser)
    })

    test('fuction returned by useHandleRequestResponse custom hook must be called with response returned by postForm.to method', async () => {
        const submitFunction = useSubmitSignUp()
        await submitFunction(mockeFields)

        expect(mockedResponseHandlerFunction).toBeCalledWith(mockedResponse)
    })

    test('useSubmitSignUp custom hook must return the response that was returned by the response handler', async () => {
        const submitFunction = useSubmitSignUp()
        const result = await submitFunction(mockeFields)
        expect(result).toBe(mockedResponse)
    })
})