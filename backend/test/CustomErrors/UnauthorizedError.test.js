const { UnauthorizedError } = require('../../src/CustomErrors')
const BaseError = require('../../src/CustomErrors/BaseError')

describe('Unit tests of the Invalid Credentials Error class', () => {
    
    it('must instantiate an error with name UnauthorizedError and message entered in constructor', () => {
        const testMessage = 'Test Message'
        const testError = new UnauthorizedError(testMessage)

        expect(testError).toBeInstanceOf(BaseError)
        expect(testError.name).toBe('UnauthorizedError')
        expect(testError.message).toBe(testMessage)
        expect(testError.statusCode).toBe(403)
    })
})