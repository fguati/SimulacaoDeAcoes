const { validateLogin } = require('#root/src/services/validate.js')
const UserDAO = require('#root/src/db/ComunicationDB/user.js')

jest.mock('#root/src/services/hash.js', () => {
    return { checkifValidPassword: jest.fn() }
})
const { checkifValidPassword } = require('#root/src/services/hash.js')

describe('Unit tests of validate login function', () => {
    const saltExample = 'salt'
    UserDAO.selectByEmail = jest.fn(email => ({ senhaHash: email, salt: saltExample }))
    const enteredEmail = 'email'
    const enteredPassword = 'password'

    it('must call UserDAO.selectByEmail method with entered email', async () => {
        await validateLogin(enteredEmail, enteredPassword)
        expect(UserDAO.selectByEmail).toBeCalledWith(enteredEmail)
    })

    it('must call checkifValidPassword method with entered email', async () => {
        await validateLogin(enteredEmail, enteredPassword)
        expect(checkifValidPassword).toHaveBeenLastCalledWith(enteredPassword, enteredEmail, saltExample)
    })
})
