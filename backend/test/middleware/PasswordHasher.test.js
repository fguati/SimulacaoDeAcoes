const { generateHashedPasswordAndSalt } = require("#root/src/services/hash.js");
const { InvalidInputError } = require("../../src/CustomErrors/InvalidInputError.js");
const PasswordHasher = require('../../src/middleware/PasswordHasher.js')
const { createMocks } = require('node-mocks-http');
jest.mock('#root/src/services/hash.js', () => ({
    generateHashedPasswordAndSalt: password => ({
        hashed_password: 'TestHashedPassWord', 
        salt: 'testSalt'
    })
}))

function mockReqResNext() {
    const { req, res } = createMocks();
    const next = jest.fn()

    return { req, res, next }
}

describe('Test the PasswordHasher Middleware', () => {
    const { req, res, next } = mockReqResNext()

    test('Method HashUserPassword must change the salt and hashed_password properties and call the next function after', () => {
        req.body.password = 'TestPassword'
        PasswordHasher.HashUserPassword(req, res,next)

        expect(req.body.hashed_password).toBe('TestHashedPassWord')
        expect(req.body.salt).toBe('testSalt')
        expect(next).toBeCalled()
    })

    test('Method HashUserPassword must call next with InvalidInputError if request does not have a password', () => {
        req.body.password = null
        PasswordHasher.HashUserPassword(req, res, next)

        expect(next).toBeCalledWith(expect.any(InvalidInputError))
    })

})