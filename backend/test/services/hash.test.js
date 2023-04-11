const { generateHashedPasswordAndSalt, checkifValidPassword } = require('../../src/services/hash.js')

describe('Test the functions used to hash and validate hashed passwords', () => {
    const testPassword = 'test password'
    
    test('generate function must return an object with salt and hashedPassword properties', () => {
        const result = generateHashedPasswordAndSalt(testPassword);
        expect(result).toEqual(expect.objectContaining({
            salt: expect.any(String),
            hashed_password: expect.any(String)
        }))
    })

    test('generate function must create 2 different values of salt and hashedPassword if ran twice', () => {
        const object1 = generateHashedPasswordAndSalt(testPassword)
        const object2 = generateHashedPasswordAndSalt(testPassword)

        expect(object1.salt).not.toBe(object2.salt)
        expect(object1.hashed_password).not.toBe(object2.hashed_password)
    })
 
    test('check function must return true if entered password matches dbpassword', () => {
        const testPassword = 'test password'
        const {hashed_password, salt} = generateHashedPasswordAndSalt(testPassword)

        const result = checkifValidPassword(testPassword, hashed_password, salt)

        expect(result).toBe(true)
    })

    test('check function must return false if salt or password is incorrect', () => {
        const {hashed_password, salt} = generateHashedPasswordAndSalt(testPassword)
        const incorrectSalt = salt+'1'
        const incorrectPassword = 'incorrect'

        let result = checkifValidPassword(testPassword, hashed_password, incorrectSalt)
        expect(result).toBe(false)

        result = checkifValidPassword(incorrectPassword, hashed_password, salt)
        expect(result).toBe(false)
        
    })

})