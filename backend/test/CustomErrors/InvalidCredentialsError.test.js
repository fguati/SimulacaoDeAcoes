const { InvalidCredentialsError } = require('../../src/CustomErrors')

describe('Unit tests of the Invalid Credentials Error class', () => {
    
    it('must instantiate an error with name InvalidCredentialsError and message entered in constructor', () => {
        const testMessage = 'Test Message'
        const testError = new InvalidCredentialsError(testMessage)

        expect(testError).toBeInstanceOf(Error)
        expect(testError.name).toBe('InvalidCredentialsError')
        expect(testError.message).toBe(testMessage)
    })
})