import { renderHook } from '@testing-library/react-hooks';
import useSubmitLoginRequest from './useSubmitLoginRequest';
import useLoginSuccessHandler from './useLoginSuccessHandler';
import { postForm, useHandleRequestResponse, addProperties } from "utils/BackendAPICommunication/";

jest.mock('./useLoginSuccessHandler')
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
	const mockedToTarget = jest.fn()
	const mockedToRoute = jest.fn()

	const mockuseLoginSuccessHandler = useLoginSuccessHandler as jest.MockedFunction<typeof useLoginSuccessHandler>
	const mockuseHandleRequestResponse = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
	const mockedAddProperties = addProperties as jest.MockedFunction<typeof addProperties>
	const mockedPostForm = postForm as jest.MockedFunction<typeof postForm>

	const mockEvent = {
		preventDefault: jest.fn(),
		target: {
			'E-mail': { value: 'test@example.com' },
			Password: { value: 'password' },
		}
	}

	beforeEach(() => {
		mockuseLoginSuccessHandler.mockReturnValue(mockSuccessFunction)
		mockuseHandleRequestResponse.mockReturnValue(mockResponseHandler)
		mockedAddProperties.mockImplementation(() => ({
			toTarget: mockedToTarget.mockImplementation(target => target)
		}))
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

		await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(mockuseLoginSuccessHandler).toBeCalled()
	})

	it('calls the useHandleRequestResponse hook with the mocked Success Handler function', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(mockuseHandleRequestResponse).toBeCalledWith(mockSuccessFunction)
	})

	it('calls the toTarget method from the addProperties object with the target of the mockEvent', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(mockedAddProperties).toBeCalled()
		expect(mockedToTarget).toBeCalledWith(mockEvent.target)

	})

	it('calls the postFormTo function with the an user that is the same as the target of the mockEvent and with the route /login', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(mockedPostForm).toBeCalledWith(expect.objectContaining({
			'email': mockEvent.target['E-mail'].value,
			'senha': mockEvent.target.Password.value
		}))
		expect(mockedToRoute).toBeCalledWith('/login')

	})

	it('calls the response handler created by the useHandleRequestResponse hook with the user from the event target', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(mockResponseHandler).toBeCalledWith(expect.objectContaining({
			'email': mockEvent.target['E-mail'].value,
			'senha': mockEvent.target.Password.value
		}))

	})

	it('returns a function that itself has the same return value as the response handler function generated by the useHandleRequestResponse hook', async () => {
		const { result } = renderHook(() => useSubmitLoginRequest())

		const returnValue = await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
		expect(returnValue).toEqual(expect.objectContaining({
			'email': mockEvent.target['E-mail'].value,
			'senha': mockEvent.target.Password.value
		}))
		
	})


})

