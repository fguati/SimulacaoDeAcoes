const LoginController = require("../../src/controllers/login")

describe('Unitary tests of Login Controller', () => {
    test.skip('Controller must retur invalid input error message in case of missing email or password', async () => {
        let myInit = {
            body: {
                email:''
            }
        }
        
        let mockRequest = new Request('exampleURL', myInit)
        let enterRes = new Response()

        const response = await LoginController.login(mockRequest, enterRes)

        expect(response.status).toBe(422)
        
    })
})