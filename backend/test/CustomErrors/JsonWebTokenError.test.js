const { JsonWebTokenError } = require('../../src/CustomErrors')

describe('Testing the Invalid Credentials Error class', () => {
    const testMessage = 'Test Message'
    const testError = new JsonWebTokenError(testMessage)
    
    it('must instantiate an error', () => {
        expect(testError).toBeInstanceOf(Error)
    })

    it('must instantiate an error with name InvalidCredentialsError', () => {
        expect(testError.name).toBe('JsonWebTokenError')
    })

    it('must have the message entered in the constructor', () => {
        expect(testError.message).toBe(testMessage)
    })
})