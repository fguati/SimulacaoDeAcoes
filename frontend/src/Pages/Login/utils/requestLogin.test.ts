import requestLogin from './requestLogin';
import IUser from 'Interfaces/IUser';
import backendURL from 'Common/backEndUrl';

describe('testing the requestLogin function', () => {
    const mockUser: IUser = { email: 'testuser', senha: 'testpassword' };
    const mockResponse = { status: 200, json: jest.fn().mockResolvedValue({})  };
    const mockFetch = jest.fn(() => Promise.resolve(mockResponse));
  
    beforeAll(() => {
      (global as any).fetch = mockFetch;
    });
  
    afterAll(() => {
      if ((global as any).fetch) {
        delete (global as any).fetch;
      }
    });
  
    it('calls the fetch function with the correct parameters', async () => {
      const response = await requestLogin(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(backendURL+'/login', {
        method: 'POST',
        body: JSON.stringify(mockUser),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      });
      
    });

});