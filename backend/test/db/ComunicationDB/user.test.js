const { InvalidInputError, UniqueConstraintError, InvalidCredentialsError, NotFoundError } = require('../../../src/CustomErrors')
const UserDAO = require('../../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../../src/db/utils/dbutils.js')

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
    }

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

describe('Unit tests for the updateBalance method of the userDAO class', () => {
    it('must update the balance with the entered value, be it positive or negative', async () => {
        const testId = 16 // id of user for balance tests in test db
        async function getUserBalance() {
            const balance = await dbGet(`SELECT user_balance FROM users WHERE id=?`, [testId])
            return balance.user_balance
        }

        const depositTest = 100
        await UserDAO.updateBalance(testId, depositTest)
        let balanceDB = await getUserBalance()
        expect(balanceDB).toBe(depositTest)

        const withdrawTest = -50
        await UserDAO.updateBalance(testId, withdrawTest)
        balanceDB = await getUserBalance()
        expect(balanceDB).toBe(depositTest + withdrawTest)
        
    })

    it('must throw not found error if user id is not in db', async () => {
        async function testFunction() {
            const invalidId = 9999999999999
            await UserDAO.updateBalance(invalidId, 1)
        }

        await expect(testFunction).rejects.toThrow(NotFoundError)
    })

    it('must throw invalid input error if change would make balance negative', async () => {
        async function testFunction() {
            const invalidId = 16 // id of user for balance tests in test db
            const testInvalidWithdraw = -10000000
            await UserDAO.updateBalance(invalidId, testInvalidWithdraw)
        }

        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })
})