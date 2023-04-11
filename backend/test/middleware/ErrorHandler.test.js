const BaseError = require('../../src/CustomErrors/BaseError')
const { errorHandler } = require('../../src/middleware/errorHandler.js')
const { createMocks } = require('node-mocks-http');

function mockReqResNext() {
    const { req, res } = createMocks();
    const next = jest.fn()

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

    return { req, res, next }
}

describe('Test the errorHandler Middleware', () => {
    const { req, res, next } = mockReqResNext()

    it('must return a error response with the info of the received error', () => {
        const testErrorMessage = 'Test Error Message'
        const testStatusCode = 400
        const testAditionalInfo = 'test aditional error info'
        
        const testError = new BaseError(testErrorMessage, testStatusCode, testAditionalInfo)
        const received = errorHandler(testError, req, res, next)
        const receivedBody = JSON.parse(received.body)

        expect(received.statusCode).toBe(testStatusCode)
        expect(receivedBody).toEqual(expect.objectContaining({
            name: testError.name,
            message: expect.stringContaining(testErrorMessage),
            aditionalInfo: expect.stringContaining(testAditionalInfo)
        }))
        
    })

    it('must return an error response with status 500 if error is not base error', () => {
        const testErrorMessage = 'Test Message'
        const testError = new Error(testErrorMessage)

        const received = errorHandler(testError, req, res, next)
        const receivedBody = JSON.parse(received.body)

        expect(received.statusCode).toBe(500)
        expect(receivedBody).toEqual(expect.objectContaining({
            message: testErrorMessage,
            name: testError.name
        }))
    })
})