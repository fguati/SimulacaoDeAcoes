const { generateHashedPasswordAndSalt, checkifValidPassword } = require('../../src/services/hash.js')

describe('Test the functions used to has and validate hashed passwords', () => {
    test('generate function must an object with salt and hashedPassword properties', () => {
        const result = generateHashedPasswordAndSalt('test password');
        expect(result).toEqual(expect.objectContaining({
            salt: expect.any(String),
            hashedPassword: expect.any(String)
        }))
    })

    test('generate function must create 2 different values of salt if ran twice', () => {
        const object1 = generateHashedPasswordAndSalt('test password')
        const object2 = generateHashedPasswordAndSalt('test password')

        expect(object1.salt).not.toBe(object2.salt)
    })

    test('generate function must create 2 different values of hashedPassword if ran twice', () => {
        const object1 = generateHashedPasswordAndSalt('test password')
        const object2 = generateHashedPasswordAndSalt('test password')

        expect(object1.hashedPassword).not.toBe(object2.salt)
    })
    
    test('check function must return true if entered password matches dbpassword', () => {
        const testPassword = 'test password'
        const {hashedPassword, salt} = generateHashedPasswordAndSalt(testPassword)

        const result = checkifValidPassword(testPassword, hashedPassword, salt)

        expect(result).toBe(true)
    })

    test('check function must return false if salt is incorrect', () => {
        const testPassword = 'test password'
        const {hashedPassword, salt} = generateHashedPasswordAndSalt(testPassword)
        const incorrectSalt = salt+'1'

        const result = checkifValidPassword(testPassword, hashedPassword, incorrectSalt)

        expect(result).toBe(false)
    })

    test('check function must return false if password is incorrect', () => {
        const testPassword = 'test password'
        const {hashedPassword, salt} = generateHashedPasswordAndSalt(testPassword)
        const incorrectPassword = 'incorrect'

        const result = checkifValidPassword(incorrectPassword, hashedPassword, salt)

        expect(result).toBe(false)
    })
})