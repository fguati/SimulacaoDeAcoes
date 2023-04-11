const { NotFoundError } = require('../../src/CustomErrors');
const BaseError = require('../../src/CustomErrors/BaseError')

describe('Unit tests of the UniqueConstraintError class', () => {
    
    it('must instantiate an object with a message and the name NotFoundError', () => {
        let testError = new NotFoundError('test message');
        
        expect(testError).toBeInstanceOf(BaseError)
        expect(testError).toEqual(expect.objectContaining({
            name: 'NotFoundError',
            message: expect.stringContaining('test message'),
            statusCode: 404
        }))

    })
})