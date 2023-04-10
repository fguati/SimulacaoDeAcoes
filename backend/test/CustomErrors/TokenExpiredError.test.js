const { TokenExpiredError } = require('../../src/CustomErrors')
const BaseError = require('../../src/CustomErrors/BaseError')


describe('Unit tests of the Invalid Credentials Error class', () => {
    
    it('must instantiate an error with name InvalidCredentialsError, with attributes message and expiredAt', () => {
        const testMessage = 'Test Message'
        const testExpiration = [1234]
        const testError = new TokenExpiredError(testMessage, testExpiration)

        expect(testError).toBeInstanceOf(BaseError)
        expect(testError.name).toBe('TokenExpiredError')
        expect(testError.message).toBe(testMessage)
        expect(testError.expiredAt).toBe(testExpiration)
        expect(testError.statusCode).toBe(401)

    })

})