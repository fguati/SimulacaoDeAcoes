const { JsonWebTokenError } = require('../../src/CustomErrors')
const BaseError = require('../../src/CustomErrors/BaseError')

describe('Unit tests of the Invalid Credentials Error class', () => {
    
    it('must instantiate an error with name JsonWebTokenError and message entered in the constructor', () => {
        const testMessage = 'Test Message'
        const testError = new JsonWebTokenError(testMessage)

        expect(testError).toBeInstanceOf(BaseError)
        expect(testError.name).toBe('JsonWebTokenError')
        expect(testError.message).toBe(testMessage)
        expect(testError.statusCode).toBe(401)

    })

})