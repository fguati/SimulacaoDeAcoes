import { renderHook } from '@testing-library/react-hooks';
import useSubmitLoginRequest from 'Pages/Login/utils/useSubmitLoginRequest';
import useLoginSuccessHandler from 'Pages/Login/utils/useLoginSuccessHandler';
import { postForm, useHandleRequestResponse } from "utils/BackendAPICommunication/";
import IFormField from 'Interfaces/IFormField';

jest.mock('Pages/Login/utils/useLoginSuccessHandler')
jest.mock('utils/BackendAPICommunication/', () => {
  return {
    __esModule: true,
    ...jest.requireActual('utils/BackendAPICommunication/'),
    postForm: jest.fn(),
    useHandleRequestResponse: jest.fn(),
    addProperties: jest.fn(() => {
      return { toTarget: jest.fn(target => target) }
    })
  }
})

describe('unit tests of the useSubmitLoginRequest custom hook', () => {
	const mockSuccessFunction = jest.fn()
	const mockResponseHandler = jest.fn()
	const mockedToRoute = jest.fn()

	const mockuseLoginSuccessHandler = useLoginSuccessHandler as jest.MockedFunction<typeof useLoginSuccessHandler>
	const mockuseHandleRequestResponse = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
	const mockedPostForm = postForm as jest.MockedFunction<typeof postForm>

	const mockList: IFormField[] = [
			{name: 'E-mail', type:'email', value:'', fieldProperty: 'email'}, 
			{name: 'Password', type:'password', value:'', fieldProperty: 'password'}
	] 
	

	beforeEach(() => {
		mockuseLoginSuccessHandler.mockReturnValue(mockSuccessFunction)
		mockuseHandleRequestResponse.mockReturnValue(mockResponseHandler)
		mockedPostForm.mockImplementation(user => ({
			to: mockedToRoute.mockImplementation((route) => Promise.resolve(user))
		}))
		mockResponseHandler.mockImplementation(response => response)
	})

	afterEach(() => {
	jest.clearAllMocks()
	})


	it('calls the useLoginSuccessHandler hook', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockList)
		expect(mockuseLoginSuccessHandler).toBeCalled()
	})

	it('calls the useHandleRequestResponse hook with the mocked Success Handler function', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockList)
		expect(mockuseHandleRequestResponse).toBeCalledWith(mockSuccessFunction)
	})


	it('calls the postFormTo function with the an user that is the same as the target of the mockEvent and with the route /login', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockList)
		expect(mockedPostForm).toBeCalledWith(expect.objectContaining({
			'email': mockList[0].value,
			'password': mockList[1].value
		}))
		expect(mockedToRoute).toBeCalledWith('/login')

	})

	it('calls the response handler created by the useHandleRequestResponse hook with the user from the event target', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockList)
		expect(mockResponseHandler).toBeCalledWith(expect.objectContaining({
			'email': mockList[0].value,
			'password': mockList[1].value
		}))

	})

	it('returns a function that itself has the same return value as the response handler function generated by the useHandleRequestResponse hook', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		const returnValue = await result.current(mockList)
		expect(returnValue).toEqual(expect.objectContaining({
			'email': mockList[0].value,
			'password': mockList[1].value
		}))
		
	})


})

