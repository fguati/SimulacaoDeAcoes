const checkUniqueConstraintError = require('#root/src/utils/checkUniqueConstraintError.js')
const { UniqueConstraintError } = require('#root/src/CustomErrors/index.js')

describe('Unit tests for the checkUniqueConstraintError function', () => {
    it('must throw UniqueConstraintError if error received has words SQLITE_CONSTRAINT UNIQUE in its message', () => {
        const testError = new Error('SQLITE_CONSTRAINT UNIQUE users ...')

        function testFunction() {
            return checkUniqueConstraintError(testError)
        }

        expect(testFunction).toThrowError(UniqueConstraintError)
    })
})