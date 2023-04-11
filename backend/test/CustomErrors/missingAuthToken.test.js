const { MissingAuthTokenError } = require('../../src/CustomErrors');
const BaseError = require('../../src/CustomErrors/BaseError')

describe('Unit tests of the UniqueConstraintError class', () => {
    
    it('must instantiate an object with a message and the name MissingAuthTokenError', () => {
        let testError = new MissingAuthTokenError('test message');
        
        expect(testError).toBeInstanceOf(BaseError)
        expect(testError).toEqual(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.stringContaining('test message'),
            statusCode: 401
        }))

    })
})