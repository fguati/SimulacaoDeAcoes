const { generateJWT } = require('../../src/services/tokens.js')

describe('Test the functions responsible for dealing with standard jwts', () => {
    test('generateJWT must return a string', () => {
        const testPayload = {
            id: '1',
            name: 'teste'
        }

        const token = generateJWT(testPayload)
        expect(token).toEqual(expect.any(String))
    })
})