import IErrorResponse from "Interfaces/IErrorResponse";
import { handleErrorResponse } from "utils/BackendAPICommunication"

describe('Tests the error response handler function', () => {
    it('calls the navigate function with the /error route and a state that equals the error response object', async () => {
        //@ts-ignore
        let response:IErrorResponse = {
            code: 400,
            message: 'Invalid input'
        }
        
        const navigate = jest.fn();

        await handleErrorResponse(response, navigate);

        expect(navigate).toHaveBeenCalledWith('/error', {
            state: JSON.stringify({ code: 400, message: 'Invalid input' }),
        });
    })
})