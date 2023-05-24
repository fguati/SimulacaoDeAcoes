import { BackendRoutes } from "Common/Types"
import IFormField from "Interfaces/IFormField"
import IServerResponse from "Interfaces/IServerResponse"
import { useHandleRequestResponse, fetchFromServer } from "utils/BackendAPICommunication/"
import useSubmitForm from "utils/BackendAPICommunication/useSubmitForm"

jest.mock('utils/BackendAPICommunication/', () => {
    const originalModule = jest.requireActual('utils/BackendAPICommunication/')
    return {
        ...originalModule,
        postForm: jest.fn(),
        useHandleRequestResponse: jest.fn()
    }
})

describe('Test the custom hook use submit form', () => {
    const mockedUseHandleRequestResponseHook = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
    const mockedServerReq = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>


    const mockUseSuccessHandlerHook = jest.fn()
    const mockedSuccessHandlerFunction = jest.fn()
    const mockedResponseHandlerFunction = jest.fn()
    const mockedToRouteMethod = jest.fn()

    const testRoute: BackendRoutes = '/register'

    const mockedForm = {
        Username: {value: 'mockedUser'},
        "E-mail": {value: 'mockedEmail'},
        Password: {value: 'mockedPassword'}
    }
    const mockedResponse: IServerResponse<unknown> = {
        ok: true,
        code: 200,
        body: mockedForm
    }

    const mockeFields:IFormField[] = [
        {name: 'Username', type: 'text', value:mockedForm.Username.value, fieldProperty: 'username'},
        {name: 'E-mail', type:'email', value: mockedForm["E-mail"].value, fieldProperty: 'email'}, 
        {name: 'Password', type:'password', value:mockedForm.Password.value, fieldProperty: 'password'},
        {name: 'Confirm Password', type: 'password', value:mockedForm.Password.value}
    ] 
    
    beforeEach(() => {
        mockUseSuccessHandlerHook.mockReturnValue(mockedSuccessHandlerFunction)
        mockedResponseHandlerFunction.mockImplementation((response) => Promise.resolve(response))
        mockedUseHandleRequestResponseHook.mockReturnValue(mockedResponseHandlerFunction)


        mockedToRouteMethod.mockResolvedValue(mockedResponse)
        mockedServerReq.mockResolvedValue(mockedResponse)
    })

    test('useHandleRequestResponse custom hook must be called with the success handler function', () => {       
        useSubmitForm(testRoute, mockUseSuccessHandlerHook)
        expect(mockedUseHandleRequestResponseHook).toBeCalledWith(mockedSuccessHandlerFunction)
    
    })

    test('fetchFromServer method must be called with entered route and user with the same properties as the mockedForm', async () => {
        const submitFunction = useSubmitForm(testRoute, mockUseSuccessHandlerHook)
        await submitFunction(mockeFields)
        const mockedUser = {
            username: mockedForm.Username.value,
            email: mockedForm["E-mail"].value,
            password: mockedForm.Password.value
        }
        expect(mockedServerReq).toBeCalledWith(mockedUser)
    })

    test('fuction returned by useHandleRequestResponse custom hook must be called with response returned by postForm.to method', async () => {
        const submitFunction = useSubmitForm(testRoute, mockUseSuccessHandlerHook)
        await submitFunction(mockeFields)

        expect(mockedResponseHandlerFunction).toBeCalledWith(mockedResponse)
    })

    test('useSubmitForm custom hook must return the response that was returned by the response handler', async () => {
        const submitFunction = useSubmitForm(testRoute, mockUseSuccessHandlerHook)
        const result = await submitFunction(mockeFields)
        expect(result).toBe(mockedResponse)
    })
})