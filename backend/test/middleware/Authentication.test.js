const { createMocks } = require('node-mocks-http');
const { MissingAuthTokenError } = require('../../src/CustomErrors/index.js');
const Authentication = require('../../src/middleware/Authentication');
const JWToken = require('#root/src/services/tokens.js')

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

//integration tests for authentication are made in the routes that require it, such as user routes
describe('unit tests for Authentication middleware class', () => {
    
    //mocking external dependencies: their unit tests are conducted in their own test files
    const returnOfValidateJWT = 'payload' 
    const mockValidate = jest.fn()
    mockValidate.mockReturnValue(returnOfValidateJWT)
    JWToken.validateJWT = mockValidate
    
    it('must call validateJWT method if receives authToken through cookie', async () => {
        const { req, res, next } = mockReqResNext() 
        
        req.cookies = {
            authToken: 'exampleToken'
        }

        await Authentication.authToken(req, res, next)

        expect(JWToken.validateJWT).toBeCalledWith(req.cookies.authToken)
        expect(next).toBeCalledTimes(1)
    })

    it('must store the return of the validateJWT method in the body of the req object', async () => {
        const { req, res, next } = mockReqResNext() 
        
        req.cookies = {
            authToken: 'exampleToken'
        }

        await Authentication.authToken(req, res, next)

        expect(req.body.payloadJWT).toEqual(returnOfValidateJWT)
        
    })

    it('must call next with a MissingAuthTokenError if authToken is not received throough cookies', async () => {
        const { req, res, next } = mockReqResNext() 

        await Authentication.authToken(req, res, next)

        expect(next).toBeCalledWith(expect.any(MissingAuthTokenError))

    })

})


