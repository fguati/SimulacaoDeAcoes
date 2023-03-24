const { generateHashedPasswordAndSalt, checkifValidPassword } = require('../../src/services/hash.js')

describe('Test the functions used to hash and validate hashed passwords', () => {
    const testPassword = 'test password'
    
    test('generate function must return an object with salt and hashedPassword properties', () => {
        const result = generateHashedPasswordAndSalt(testPassword);
        expect(result).toEqual(expect.objectContaining({
            salt: expect.any(String),
            hashedPassword: expect.any(String)
        }))
    })

    test('generate function must create 2 different values of salt and hashedPassword if ran twice', () => {
        const object1 = generateHashedPasswordAndSalt(testPassword)
        const object2 = generateHashedPasswordAndSalt(testPassword)

        expect(object1.salt).not.toBe(object2.salt)
        expect(object1.hashedPassword).not.toBe(object2.hashedPassword)
    })
 
    test('check function must return true if entered password matches dbpassword', () => {
        const testPassword = 'test password'
        const {hashedPassword, salt} = generateHashedPasswordAndSalt(testPassword)

        const result = checkifValidPassword(testPassword, hashedPassword, salt)

        expect(result).toBe(true)
    })

    test('check function must return false if salt or password is incorrect', () => {
        const {hashedPassword, salt} = generateHashedPasswordAndSalt(testPassword)
        const incorrectSalt = salt+'1'
        const incorrectPassword = 'incorrect'

        let result = checkifValidPassword(testPassword, hashedPassword, incorrectSalt)
        expect(result).toBe(false)

        result = checkifValidPassword(incorrectPassword, hashedPassword, salt)
        expect(result).toBe(false)
        
    })

})