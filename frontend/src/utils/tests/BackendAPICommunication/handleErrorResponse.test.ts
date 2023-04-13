import { handleErrorResponse } from "utils/BackendAPICommunication"

describe('Tests the error response handler function', () => {
    it('calls the navigate function with the /error route and a state that equals the error response object', async () => {
        //@ts-ignore
        let response = new Response(JSON.stringify({ message: 'Invalid input' }), {status: 400})

        const navigate = jest.fn();

        await handleErrorResponse(response, navigate);

        expect(navigate).toHaveBeenCalledWith('/error', {
            state: JSON.stringify({ message: 'Invalid input', code: 400 }),
        });
    })
})