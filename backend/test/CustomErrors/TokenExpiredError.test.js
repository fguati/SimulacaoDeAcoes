const { TokenExpiredError } = require('../../src/CustomErrors')

describe('Testing the Invalid Credentials Error class', () => {
    const testMessage = 'Test Message'
    const testExpiration = [1234]
    const testError = new TokenExpiredError(testMessage, testExpiration)
    
    it('must instantiate an error', () => {
        expect(testError).toBeInstanceOf(Error)
    })

    it('must instantiate an error with name InvalidCredentialsError', () => {
        expect(testError.name).toBe('TokenExpiredError')
    })

    it('must have the message entered in the constructor', () => {
        expect(testError.message).toBe(testMessage)
    })

    it('must have the expiredAt entered in the constructor', () => {
        expect(testError.expiredAt).toBe(testExpiration)
    })
})