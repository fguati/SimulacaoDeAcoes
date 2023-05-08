const { InvalidInputError, UniqueConstraintError, InvalidCredentialsError } = require('../../../src/CustomErrors')
const UserDAO = require('../../../src/db/ComunicationDB/user.js')
const { dbGet, dbRun } = require('../../../src/db/utils/dbutils.js')

describe('Unit tests of select queries to users table in DB', () => {
    it('must return a list of objects with properties username, email, hashes_password when has no arguments', async () => {
        const listOfUsers = await UserDAO.select()
        
        expect(listOfUsers.length).toBeGreaterThan(0)
        expect(listOfUsers[0]).toEqual(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String),
            
        }))
    })

    it('must return a list of objects with the queried property', async () => {
        const listOfUsers = await UserDAO.select('username')

        expect(listOfUsers[0]).toEqual({
            username: expect.any(String)
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
    
    it('must return an object with username, email and hashed_password properties', async () => {
        const testId = 1
        
        const user = await UserDAO.selectById(testId)

        expect(user).toEqual(expect.objectContaining({
            id: testId,
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String)
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
    
    it('must return an object with username, email and hashed_password properties', async () => {
        const testEmail = 'test@selectbyemail'

        const user = await UserDAO.selectByEmail(testEmail)
        expect(user).toEqual(expect.objectContaining({
            username: expect.any(String),
            email: testEmail,
            hashed_password: expect.any(String),
            salt: expect.any(String)
        }))
    })

    it('must throw an InvalidCredentialsError if the email queried is Invalid', async () => {

        async function testFunction() {
            await UserDAO.selectByEmail('dfgdsfg')
        }
        
        await expect(testFunction).rejects.toThrow(InvalidCredentialsError)
    })

})

describe('Unit tests of the insert method of the class responsible for querying the user table in the DB', () => {
    
    const userToBeInserted = {
        username: 'userToBeInserted',
        email: 'user@tobeinserted',
        hashed_password: 'test_hashed_password',
        salt: 'test_salt'
    };

    const userWithError = {
        username: 'userWithInsertError',
        email: 'user@withinserterror',
        hashed_password: 'test_hashed_password',
        salt: 'test_salt'
    }

    async function getId({ username, email }) {
        let sql = `SELECT id FROM users WHERE username=? AND email=?`;
        const resultado = await dbGet(sql, [username, email])
    
        return resultado.id
    };

    async function getObjectById(id) {
        let sql = `SELECT * FROM users WHERE id=?`;
        const resultado = await dbGet(sql, [id])
    
        return resultado
    }

    it('must create an entry in the db with a numerical id that is the object inserted', async () => {
        await UserDAO.insert(userToBeInserted)

        const idOfInsertedUser = await getId(userToBeInserted)
        let userInserted = await getObjectById(idOfInsertedUser)
        
        expect(typeof idOfInsertedUser).toBe('number')
        expect(userInserted).toEqual(expect.objectContaining({
            username: userToBeInserted.username, 
            email: userToBeInserted.email,
            hashed_password: userToBeInserted.hashed_password,
            salt: userToBeInserted.salt
        }))

    });


    it('must throw an UniqueConstraintError if has an repeated email', async () => {
        async function testFunction() {
            await UserDAO.insert(userToBeInserted)
        }

        expect(testFunction).rejects.toThrow(UniqueConstraintError)

    })

    it('must throw an InvalidInputError if has a missing or invalid mandatory field', async () => {
        async function testFunction() {
            await UserDAO.insert(missingInputObj)
        }

        let missingInputObj = {
            email: userWithError.email,
            hashed_password: userWithError.hashed_password
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            username: userWithError.username,
            hashed_password: userWithError.hashed_password
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)

        missingInputObj = {
            username: userWithError.username,
            email: userWithError.email
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            username: null,
            email: userWithError.email,
            hashed_password: userWithError.hashed_password
        };
    
        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        missingInputObj = {
            username: userWithError.username,
            email: null,
            hashed_password: userWithError.hashed_password
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        missingInputObj = {
            username: userWithError.username,
            email: userWithError.email,
            hashed_password: null
        };
        
        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

})

describe('Unit tests of the delete method of the class responsible for querying the user table in the DB', () => {
    const userToBeDeleted = {
        username: 'TestDAODelete',
        email: 'testDAO@delete',
        hashed_password: 'c1919704fb59beecb35114c6f44ea15860c306a235c7f9c6cdc4cb6a51ba4d2b1c18730714b54f9c66a579357a4e02df62cee25b1ac95ad45bb9c081f401e08a',
        salt: 'ca149aada51bee0f3bd71c7606347e88d3402a9c077b870e45bcedefa1996b65241834a9752de095fd6d9fb78c71318f89d4c90d7336afce4c32ed4a3fb191b36ca194445f143f53042e578917a38ee5b9312807318b27294f5859bded58ab90b4a0a69c84e11973945e1c463af5ea29362e6de4b24598ceedaff43ddd66df03'
    };

    async function getId({ username, email }) {
        let sql = `SELECT id FROM users WHERE username=? AND email=?`;
        const resultado = await dbGet(sql, [username, email])
    
        return resultado.id
    };

    async function getObjectById(id) {
        let sql = `SELECT * FROM users WHERE id=?`;
        const resultado = await dbGet(sql, [id])
    
        return resultado
    }

    it('must delete created entry', async () => {
        await UserDAO.delete(3)
        const result = await getObjectById(3)
        await expect(result).toBe(undefined)

    })

    it('delete must throw an InvalidInputError if has invalid id', async () => {
        async function testFunction() {
            await UserDAO.delete('fsdg')
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
    })
})