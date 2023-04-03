import { renderHook } from '@testing-library/react-hooks';
import useSubmitLoginRequest from './useSubmitLoginRequest';

jest.mock('./handleLoginResponse', () => jest.fn(() => jest.fn()))

import useHandleLoginResponse from './useLoginSuccessHandler';

describe('testing the useSubmitLoginRequest custom hook', () => {
    const mockHandleLoginResponse = jest.fn(response => response)
    const mockRequestLogin = jest.fn(() => Promise.resolve({}))

    beforeEach(() => {
        const mockUseHandleLoginResponse = useHandleLoginResponse as jest.MockedFunction<typeof useHandleLoginResponse>
        mockUseHandleLoginResponse.mockReturnValue(mockHandleLoginResponse)
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls requestLogin with the correct user object', async () => {
        const { result } = renderHook(() => useSubmitLoginRequest())
        const mockEvent = {
          preventDefault: jest.fn(),
          target: {
            'E-mail': { value: 'test@example.com' },
            Password: { value: 'password' },
          }
        }
        await result.current(mockEvent as unknown as React.FormEvent<HTMLFormElement>)
        expect(mockRequestLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          senha: 'password',
        })
      })
})

