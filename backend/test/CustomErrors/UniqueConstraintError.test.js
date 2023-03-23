const { UniqueConstraintError } = require('../../src/CustomErrors');

describe('Unit tests of the UniqueConstraintError class', () => {
    
    it('must instantiate an object with an error column, a message that mentions the column and the name UniqueConstraintError', () => {
        let testError = new UniqueConstraintError('testColumn');
        
        expect(testError).toBeInstanceOf(Error)
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