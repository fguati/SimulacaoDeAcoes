import { postForm } from "utils/BackendAPICommunication"
import backendURL from "Common/backEndUrl";

describe('Tests for the postFormTo method',() => {
    const mockBody = { data: 'some data' };
    const mockRoute = '/login'
    const mockUrl = backendURL + mockRoute
    const mockInit = {
        method: 'POST',
        body: JSON.stringify(mockBody),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }
    
    beforeEach(() => {
        jest.clearAllMocks()
    });
    
    it('calls fetch with method POST and route and body entered as arguments', async () => {
        global.fetch = jest.fn().mockResolvedValue(JSON.stringify({ success: true }))
        await postForm(mockBody).to(mockRoute);
        expect(fetch).toBeCalledWith(mockUrl, mockInit);
    })


})