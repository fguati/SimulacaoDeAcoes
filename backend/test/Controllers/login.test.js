const LoginController = require("../../src/controllers/login")
const UserDAO = require("../../src/db/ComunicationDB/user")
const { dbGet, dbRun } = require("../../src/db/utils/dbutils")
const { createMocks } = require('node-mocks-http');

describe('Tests of the coltroller used for the Login route', () => {
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

    function mockReqResNext () {
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

        const next = jest.fn(param => param)

        return {req, res, next}
    }

    beforeAll(async () => {
        await clearTestUserFromDB(validCredentials)
        
        await UserDAO.insert(validCredentials)
    })

    afterAll(async () => {
        await clearTestUserFromDB(validCredentials)

    })

    test('Must return a response with a JWT in the cookies if has valid credentials', async () => {
        const { req, res, next } = mockReqResNext()
        
        const response = await LoginController.login(req, res, next)

        expect(response.statusCode).toBe(200)
        expect(response.headers['Set-Cookie']).toEqual(expect.stringContaining('authToken='))
    })

    test('Must return an invalid input error response if email or password are empty or invalid', async () => {
        const { req, res, next } = mockReqResNext()
        
        //empty email
        req.body.email = ''
        let inputError = await LoginController.login(req, res, next)
        expect(inputError.statusCode).toBe(422)
        expect(inputError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        //invalid email
        req.body.email = null
        inputError = await LoginController.login(req, res, next)
        expect(inputError.statusCode).toBe(422)
        expect(inputError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))
        req.body.email = validCredentials.email


        //empty password
        req.body.senha = ''
        inputError = await LoginController.login(req, res, next)
        expect(inputError.statusCode).toBe(422)
        expect(inputError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))

        //invalid password
        req.body.senha = null
        inputError = await LoginController.login(req, res, next)
        expect(inputError.statusCode).toBe(422)
        expect(inputError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))
        
    })

    test('Must return an invalid credentials error response if password or email are invalid', async () => {
        const {req, res, next} = mockReqResNext()

        //invalid email
        req.body.email = `invalid: ${req.body.email}`
        let credentialsError = await LoginController.login(req, res, next)

        expect(credentialsError.statusCode).toBe = 401
        expect(credentialsError).toEqual(expect.objectContaining({
            name:'InvalidCredentialsError',
            message:expect.any(String),
        }))

        //invalid password
        req.body.email = validCredentials.email
        req.body.senha = `invalid: ${req.body.senha}`
        credentialsError = await LoginController.login(req, res, next)

        expect(credentialsError.statusCode).toBe = 401
        expect(credentialsError).toEqual(expect.objectContaining({
            name:'InvalidCredentialsError',
            message:expect.any(String),
        }))
    })

})