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



describe('testing the useSubmitLoginRequest custom hook', () => {
    const mockSuccessFunction = jest.fn()
    const mockResponseHandler = jest.fn(response => response)

    const mockuseLoginSuccessHandler = useLoginSuccessHandler as jest.MockedFunction<typeof useLoginSuccessHandler>
    const mockuseHandleRequestResponse = useHandleRequestResponse as jest.MockedFunction<typeof useHandleRequestResponse>
    const mockedAddProperties = addProperties as jest.MockedFunction<typeof addProperties>
    const mockedPostForm = postForm as jest.MockedFunction<typeof postForm>

    beforeEach(() => {
      mockuseLoginSuccessHandler.mockReturnValue(mockSuccessFunction)
      mockuseHandleRequestResponse.mockReturnValue(mockResponseHandler)
      mockedAddProperties.mockImplementation(() => ({
        toTarget: jest.fn(target => target)
      }))
      mockedPostForm.mockImplementation(user => ({
        to: jest.fn().mockImplementation((route) => Promise.resolve(user))
      }))

    })

    afterEach(() => {
      jest.clearAllMocks()
    })


    it('calls the useLoginSuccessHandler hook', async () => {
        console.log('mock', addProperties)
        const { result } = renderHook(() => useSubmitLoginRequest())

        const mockEvent = {
          preventDefault: jest.fn(),
          target: {
            'E-mail': { value: 'test@example.com' },
            Password: { value: 'password' },
          }
        }

        await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
        expect(mockuseLoginSuccessHandler).toBeCalled()
      })
})

