const BaseError = require('#root/src/CustomErrors/BaseError.js');
const { createMocks } = require('node-mocks-http');

describe('Test the BaseError class', () => {
    function mockRes () {
        const { req, res } = createMocks();
        res.status = (code) => {
            res.statusCode = code    
            return res
        }
        res.send = (body) => {
            res.body = body
            return res
        }
        res.headers = {}
        res.setHeader = (header, value) => {
                res.headers[header] = value
                return res
        }
        res.set = res.setHeader

        return res
    }
    
    test('BaseError instance must also be an instance of the Error class, properties entered in constructor', () => {
        const testMessage = 'test message';
        const testStatus = 400;
        const testAditionalInfo = 'test Aditional Info' 
        const testError = new BaseError(testMessage, testStatus, testAditionalInfo)

        expect(testError).toBeInstanceOf(Error)
        expect(testError.message).toBe(testMessage)
        expect(testError.statusCode).toBe(testStatus)
        expect(testError.aditionalInfo).toBe(testAditionalInfo)
    })

    test('Default values of base Error must be the ones from Internal server error', () => {
        const testError = new BaseError();

        expect(testError.message).toBe('Internal Server Error')
        expect(testError.statusCode).toBe(500)
        expect(testError.aditionalInfo).toBe('')
    })

    test('Method sendErrorResponse must return a response object with the error information', () => {
        const testMessage = 'test message';
        const testStatus = 400;
        const testAditionalInfo = 'test Aditional Info' 
        const mockedRes = mockRes()

        const testError = new BaseError(testMessage, testStatus, testAditionalInfo)
        const testErrorResponse = testError.sendErrorResponse(mockedRes)
        const testErrorResponseBody = JSON.parse(testErrorResponse.body)

        expect(testErrorResponse).toBeInstanceOf(mockedRes.constructor)
        expect(testErrorResponse.statusCode).toBe(testError.statusCode)
        expect(testErrorResponseBody.name).toBe(testError.name)
        expect(testErrorResponseBody.message).toBe(testError.message)
        expect(testErrorResponseBody.aditionalInfo).toBe(testError.aditionalInfo)
    })
})