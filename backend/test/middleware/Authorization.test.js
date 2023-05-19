const { createMocks } = require('node-mocks-http');
const { authorization } = require('../../src/middleware/Authorization');
const { UnauthorizedError } = require('../../src/CustomErrors');

function mockReqResNext() {
    const { req, res } = createMocks();
    const next = jest.fn()
    // req.body = {}
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

describe('unit tests for Authorization middleware class', () => {
    
    it('must call next with no arguments if user role is authorized', () => {
        const { req, res, next } = mockReqResNext()
        req.body.payloadJWT = { role: 'ADMIN' }
        authorization(['ADMIN'])(req, res, next)
        expect(next).toHaveBeenCalledWith()
    })
    it('must call next with an UnauthorizedError if user role is unauthorized', () => {
        const { req, res, next } = mockReqResNext()
        req.body.payloadJWT = { role: 'CLIENT' }
        authorization(['ADMIN'])(req, res, next)
        expect(next).toHaveBeenCalledWith(new UnauthorizedError())
    })
    it('must call next with an MissingAuthTokenError if user is not logged in', () => {
        const { req, res, next } = mockReqResNext()
        authorization(['ADMIN'])(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.any(String),
            statusCode: 401
        }))
    })

})


