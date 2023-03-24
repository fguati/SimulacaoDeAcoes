const JWToken = require('../../src/services/tokens.js')
const { TokenExpiredError } = require('../../src/CustomErrors');
const { authTokenDurationInSec } = require('../../src/utils/globalVariables.js');

describe('Test the functions responsible for dealing with standard jwts', () => {
    jest.useFakeTimers();
    
    const testPayload = {
        id: '1',
        name: 'teste'
    }

    test('generateJWT must return a string', () => {
        const token = JWToken.generate(testPayload)
        expect(token).toEqual(expect.any(String))
    })

    test('validateJWT must return the entered payload', () => {
        const token = JWToken.generate(testPayload)
        const result = JWToken.validateJWT(token)
        expect(result).toEqual(expect.objectContaining(testPayload))
    })

    test('validateJWT must throw TokenExpiredError if token is expired', () => {

        const token = JWToken.generate(testPayload)
        jest.advanceTimersByTime(authTokenDurationInSec * 1000 + 1)
        
        function testFunction() {
            const result = JWToken.validateJWT(token)
            return result
        }

        expect(testFunction).toThrow(TokenExpiredError)
    })
})