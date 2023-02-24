const { InvalidInputError, UniqueConstraintError, InvalidCredentialsError } = require('../../../src/CustomErrors')
const UserDAO = require('../../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../../src/db/dbUtils.js')

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

describe('Testing select by id queries to users table in DB', ()=> {
    it('must return an object with the id entered as argument', async () => {
        const user = await UserDAO.selectById(1)
        expect(user.id).toBe(1)
    })

    it('must return an object with nome, email and senhaHash properties', async () => {
        const user = await UserDAO.selectById(1)
        expect(user).toEqual(expect.objectContaining({
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String)
        }))
    })

    it('must throw an InvalidInputError if the id queried is Invalid', async () => {

        async function testFunction() {
            await UserDAO.selectById('dfgdsfg')
        }
        
        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })

})

describe('Testing select by email queries to users table in DB', ()=> {
    it('must return an object with the email entered as argument', async () => {
        const user = await UserDAO.selectByEmail("algumExemplo")
        expect(user.email).toBe("algumExemplo")
    })

    it('must return an object with nome, email and senhaHash properties', async () => {
        const user = await UserDAO.selectByEmail("algumExemplo")
        expect(user).toEqual(expect.objectContaining({
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String)
        }))
    })

    it('must throw an InvalidCredentialsError if the email queried is Invalid', async () => {

        async function testFunction() {
            await UserDAO.selectByEmail('dfgdsfg')
        }
        
        await expect(testFunction).rejects.toThrow(InvalidCredentialsError)
    })

})

describe('Testing the insert and delete methods of the class responsible for querying the user table in the DB', () => {
    
    const userObject = {
        nome: 'TestObject',
        email: 'TestEmail@mail.com',
        senhaHash: 'SenhaHashTeste'
    };

    async function getId({ nome, email, senhaHash }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=? AND senhaHash=?`;
        const resultado = await dbGet(sql, [nome, email, senhaHash])
    
        return resultado.id
    };

    it('must create an entry in the db with a numerical id', async () => {

        await UserDAO.insert(userObject)

        const idOfInsertedUser = await getId(userObject)
        
        expect(typeof idOfInsertedUser).toBe('number')

    });

    it('must have created an entry in the db that is the object inserted', async () => {
        const idOfInsertedUser = await getId(userObject)
        
        let selectedObj = await UserDAO.selectById(idOfInsertedUser)
    
        expect(selectedObj).toEqual(expect.objectContaining(userObject))

    })

    it('must throw an UniqueConstraintError if has an repeated email', async () => {
        async function testFunction() {
            await UserDAO.insert(userObject)
        }

        expect(testFunction).rejects.toThrow(UniqueConstraintError)
    })

    it('must delete created entry', async () => {
        const idOfInsertedUser = await getId(userObject)
        
        await UserDAO.delete(idOfInsertedUser)
    
        async function testFunction() {
            await UserDAO.selectById(idOfInsertedUser)
        }
        
        await expect(testFunction).rejects.toThrow(InvalidInputError)

    })

    it('must throw an InvalidInputError if is missing name', async () => {
        const missingInputObj = {
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('must throw an InvalidInputError if is missing email', async () => {
        const missingInputObj = {
            nome: 'TestObject',
            senhaHash: 'SenhaHashTeste'
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('must throw an InvalidInputError if is missing senhaHash', async () => {
        const missingInputObj = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com'
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('must throw an InvalidInputError if has invalid name', async () => {
        const missingInputObj = {
            nome: null,
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('must throw an InvalidInputError if has invalid email', async () => {
        const missingInputObj = {
            nome: 'TestObject',
            email: null,
            senhaHash: 'SenhaHashTeste'
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('must throw an InvalidInputError if has invalid senhaHash', async () => {
        const missingInputObj = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senhaHash: null
        };

        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('delete must throw an InvalidInputError if has invalid id', async () => {
        async function testFunction() {
            await UserDAO.delete('fsdg')
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

})