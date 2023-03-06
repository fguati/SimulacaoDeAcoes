const JWToken = require('../../src/services/tokens.js')
const { TokenExpiredError } = require('../../src/CustomErrors')

describe('Test the functions responsible for dealing with standard jwts', () => {
    jest.useFakeTimers();
    
    test('generateJWT must return a string', () => {
        const testPayload = {
            id: '1',
            name: 'teste'
        }

        const token = JWToken.generate(testPayload)
        expect(token).toEqual(expect.any(String))
    })

    test('validateJWT must return the entered payload', () => {
        const testPayload = {
            id: '1',
            name: 'teste'
        }

        const token = JWToken.generate(testPayload)
        const result = JWToken.validateJWT(token)
        expect(result).toEqual(expect.objectContaining(testPayload))
    })

    test('validateJWT must throw TokenExpiredError if token is expired', () => {
        const testPayload = {
            id: '1',
            name: 'teste'
        }

        const token = JWToken.generate(testPayload)
        jest.advanceTimersByTime(5 * 60 * 1000 + 1)
        
        function testFunction() {
            const result = JWToken.validateJWT(token)
            return result
        }
        expect(testFunction).toThrow(TokenExpiredError)
    })
})