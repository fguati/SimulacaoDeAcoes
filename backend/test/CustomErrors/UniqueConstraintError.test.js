const { UniqueConstraintError } = require('../../src/CustomErrors');

describe('Test UniqueConstraintError class', () => {
    it('must instantiate an error object', () => {
        const testError = new UniqueConstraintError('test');
        expect(testError).toBeInstanceOf(Error)
    })

    it('must instantiate an object with an error column, a message that mentions the column and the name UniqueConstraintError', () => {
        let testError = new UniqueConstraintError('testColumn');
        
        expect(testError).toEqual(expect.objectContaining({
            name: 'UniqueConstraintError',
            errorColumn: 'testColumn',
            message: expect.stringContaining('testColumn')
        }))

        testError = new UniqueConstraintError('testColumn2');
        
        expect(testError).toEqual(expect.objectContaining({
            name: 'UniqueConstraintError',
            errorColumn: 'testColumn2',
            message: expect.stringContaining('testColumn2')
        }))
    })
})