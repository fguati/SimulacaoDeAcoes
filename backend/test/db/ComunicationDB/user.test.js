const { InvalidInputError } = require('../../../src/CustomErrors')
const UserDAO = require('../../../src/db/ComunicationDB/user.js')

describe('Testing select queries to users table in DB', () => {
    test('select must return a non empty list', async () => {
        const listOfUsers = await UserDAO.select()

        expect(listOfUsers.length).toBeGreaterThan(0)
    })

    it('must return a list of objects with properties nome, email, senhaHash when has no arguments', async () => {
        const listOfUsers = await UserDAO.select()

        expect(listOfUsers[0]).toEqual(expect.objectContaining({
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String)
        }))
    })

    it('must return a list of objects with the queried property', async () => {
        const listOfUsers = await UserDAO.select('nome')

        expect(listOfUsers[0]).toEqual({
            nome: expect.any(String)
        })
    })

    it('must throw an InvalidInputError if the input is Invalid', async () => {

        async function testFunction() {
            await UserDAO.select('dfgdsfg')
        }
        
        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })

})

// describe('Testing the insert and delete methods of the class responsible for querying the user table in the DB', () => {

// })