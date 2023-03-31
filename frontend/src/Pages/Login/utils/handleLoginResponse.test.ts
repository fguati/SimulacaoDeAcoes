import { useLocation, useNavigate } from 'react-router-dom';
import useHandleLoginResponse from './handleLoginResponse';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '/login' }),
    useNavigate: jest.fn()
}));

jest.mock('utils/handleErrorResponse', () => jest.fn(() => Promise.reject()));
import handleErrorResponse from 'utils/handleErrorResponse';

describe('testing the useHandleLoginResponse custom hook', () => {
    const mockNavigate = jest.fn();
  
    beforeEach(() => {
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });
  
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    it('navigates to home page when login is successful', async () => {
      const { result } = renderHook(() => useHandleLoginResponse());
      await result.current({status: 200} as Response);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  
    it('navigates to error page when login fails', async () => {

      const { result } = renderHook(() => useHandleLoginResponse());
      await result.current({ status: 404 } as Response);
      expect(handleErrorResponse).toHaveBeenCalledWith({ status: 404 }, mockNavigate);
    });
});