const UserController = require("../../src/controllers/user");
const UserDAO = require("../../src/db/ComunicationDB/user");
const { dbGet, dbRun } = require("../../src/db/dbUtils");
const { createMocks } = require('node-mocks-http');


const validCredentials = {
    nome:'TestName',
    email:'test@email',
    senha:'123'
}

async function clearTestUserFromDB(testUser) {
    const dbUser = await dbGet(`SELECT id FROM users WHERE email=?`, [testUser.email])
    if(dbUser) {
        await dbRun(`DELETE FROM users WHERE email=?`, [testUser.email])
    }
}

function mockReqRes () {
    const { req, res } = createMocks();
    req.body = {...validCredentials}
    res.status = (code) => {
        res.statusCode = code    
        return res
    }
    res.send = (body) => {
        res.body = body
        return res
    }
    res.headers = {}
    res.setHeader = (header, value) => {
        res.headers[header] = value
        return res
    }
    res.set = res.setHeader

    return {req, res}
}

beforeAll(async () => {
    await clearTestUserFromDB(validCredentials)
    
    await UserDAO.insert(validCredentials)
})

afterAll(async () => {
    await clearTestUserFromDB(validCredentials)

})

describe('test the getAll method of the UserController', () => {
    it('returns a non empty list of users', async () => {
        const {req, res} = mockReqRes()
        
        const response = await UserController.getAll(req, res)
        const userList = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(userList).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String),
            salt: expect.any(String),
    
        })]))

    })
})

describe('test getOneById method of the UserController', () => {
    it('returns a user if a valid Id is entered', async () => {
        const {req, res} = mockReqRes()

        const dbTestUser = await UserDAO.selectByEmail(validCredentials.email)
        req.params.id = dbTestUser.id

        const response = await UserController.getOneById(req, res)
        const user = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(user).toEqual(expect.objectContaining({
            id: dbTestUser.id,
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String),
            salt: expect.any(String),
        }))
    })

    it('must return an invalid input error response if id is invalid', async () => {
        const {req, res} = mockReqRes()

        const dbTestUser = await UserDAO.selectByEmail(validCredentials.email)
        req.params.id = `${dbTestUser.id}00000000000000000000000000000000000000000000000000000`

        const response = await UserController.getOneById(req, res)
        const user = JSON.parse(response.body)

        expect(response.statusCode).toBe(422)
        expect(user).toEqual(expect.objectContaining({
            name:'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('id')
        }))
    })

})

describe('test the postUser method of the user controller', () =>{
    beforeEach(async () => {
        await clearTestUserFromDB(validCredentials)
    })
    
    it('must insert a user in the db', async () => {
        const { req, res } = mockReqRes()

        const response = await UserController.postUser(req, res)
        console.log(req.body, validCredentials.email)
        expect(response.statusCode).toBe(201)

        const userInDb = await UserDAO.selectByEmail(validCredentials.email)

        expect(userInDb).toEqual(expect.objectContaining({
            email: validCredentials.email,
            nome: validCredentials.nome
        }))
    })

    it('must return invalid input error response if receive an invalid value for either name, email or password', async () => {
        const { req, res } = mockReqRes()

        //empty email
        req.body.email = ''
        let response = await UserController.postUser(req, res)
        let parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = validCredentials.email

        //empty name
        req.body.nome = ''
        response = await UserController.postUser(req, res)
        parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('nome')
        }))

        req.body.nome = validCredentials.nome
        
        //empty password
        req.body.senha = ''
        response = await UserController.postUser(req, res)
        parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))

        req.body.senha = validCredentials.senha
        
        //invalid email
        req.body.email = null
        response = await UserController.postUser(req, res)
        parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = validCredentials.email

        //invalid name
        req.body.nome = null
        response = await UserController.postUser(req, res)
        parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('nome')
        }))

        req.body.nome = validCredentials.nome
        
        //invalid password
        req.body.senha = null
        response = await UserController.postUser(req, res)
        parsedResBody = JSON.parse(response.body) 

        expect(response.statusCode).toBe(422)
        expect(parsedResBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))

        req.body.senha = validCredentials.senha
    })

    it('must return an unique constraint error if email already exists in db', async () => {
        const user = await dbGet(`SELECT * from users WHERE email=?`, [validCredentials.email])
        if(!user) {
            await dbRun(`INSERT INTO users ('nome', 'email', 'senhaHash', 'salt') VALUES (?, ?, ?, 'exampleSalt')`, [validCredentials.nome, validCredentials.email, validCredentials.senha])
        }

        const { req, res } = mockReqRes()

        const response = await UserController.postUser(req, res)
        const parsedBody = JSON.parse(response.body)

        expect(response.statusCode).toBe(422)
        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'UniqueConstraintError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        await clearTestUserFromDB(validCredentials)
    })
})