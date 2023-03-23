const { InvalidInputError, UniqueConstraintError, InvalidCredentialsError } = require('../../../src/CustomErrors')
const UserDAO = require('../../../src/db/ComunicationDB/user.js')
const { dbGet, dbRun } = require('../../../src/db/dbUtils.js')
const db = require('../../../src/db/createDB.js')

describe('Unit tests of select queries to users table in DB', () => {
    it('must return a list of objects with properties nome, email, senhaHash when has no arguments', async () => {
        const listOfUsers = await UserDAO.select()
        
        expect(listOfUsers.length).toBeGreaterThan(0)
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

describe('Unit tests of select by id queries to users table in DB', ()=> {
    
    it('must return an object with nome, email and senhaHash properties', async () => {
        const testUser = await dbGet(`SELECT id FROM users LIMIT 1`)
        const testId = testUser.id
        
        const user = await UserDAO.selectById(testId)

        expect(user).toEqual(expect.objectContaining({
            id: testId,
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

describe('Unit tests of select by email queries to users table in DB', ()=> {
    const selectSQL = `SELECT email FROM users LIMIT 1`
    
    it('must return an object with nome, email and senhaHash properties', async () => {
        let testEmail = await dbGet(selectSQL)
        testEmail = testEmail.email

        const user = await UserDAO.selectByEmail(testEmail)
        expect(user).toEqual(expect.objectContaining({
            nome: expect.any(String),
            email: testEmail,
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

describe('Unit tests of the insert and delete methods of the class responsible for querying the user table in the DB', () => {
    
    const userObject = {
        nome: 'TestObject',
        email: 'TestEmail@mail.com',
        senha: 'SenhaHashTeste'
    };

    async function getId({ nome, email }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=?`;
        const resultado = await dbGet(sql, [nome, email])
    
        return resultado.id
    };

    async function getObjectById(id) {
        let sql = `SELECT * FROM users WHERE id=?`;
        const resultado = await dbGet(sql, [id])
    
        return resultado
    }

    it('must create an entry in the db with a numerical id that is the object inserted', async () => {

        await UserDAO.insert(userObject)

        const idOfInsertedUser = await getId(userObject)
        let selectedObj = await getObjectById(idOfInsertedUser)
        const {nome, email} = userObject;
        
        expect(typeof idOfInsertedUser).toBe('number')
        expect(selectedObj).toEqual(expect.objectContaining({
            nome: nome, 
            email:email
        }))

    });


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

    it('must throw an InvalidInputError if has a missing or invalid mandatory field', async () => {
        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        let missingInputObj = {
            email: 'TestEmail@mail.com',
            senha: 'SenhaHashTeste'
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            nome: 'TestObject',
            senha: 'SenhaHashTeste'
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)

        missingInputObj = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com'
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            nome: null,
            email: 'TestEmail@mail.com',
            senha: 'SenhaHashTeste'
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            nome: 'TestObject',
            email: null,
            senha: 'SenhaHashTeste'
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        missingInputObj = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senha: null
        };
        
        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

    it('delete must throw an InvalidInputError if has invalid id', async () => {
        async function testFunction() {
            await UserDAO.delete('fsdg')
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

})