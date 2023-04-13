const app = require('../../src/app.js')
const request = require('supertest')
const JWToken = require('../../src/services/tokens.js')
const { dbGet, dbRun } = require('../../src/db/utils/dbutils.js')
const UserDAO = require('../../src/db/ComunicationDB/user.js')


beforeEach(() => {
    server = app.listen(0)
    process.env.JWT_KEY = 'testKey'
})

afterEach(() => {
    server.close()
})

describe('Test /login route', () => {
       
    async function getResponse(server, submittedData) {
        const resposta = await request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(submittedData)
        
        return resposta
    }
    
    const validLoginData = {
        username: "validLoginUser",
        email: "validlogin@user",
        password: "123"
    }
    
    it('must return an status 200 and the correct JWT authToken for a valid credentials', async () => {
        const submittedData = validLoginData
        const JWTPayload = {
            id: 5,
            username: validLoginData.username
        }
        
        const token = JWToken.generate(JWTPayload)
        const JWT = token
        
        
        const resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(200)

        expect(JSON.parse(resposta.text)['authToken']).toBe(JWT)
        
    })

    it('must return an error response if receives an invalid field', async () => {
        let submittedData = {
            email: null,
            password: validLoginData.password
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            email: validLoginData.email,
            password: null
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            email: validLoginData.email
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            password: validLoginData.password
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)

        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))
    })

    it('must return an error if receives an email or password that does not exist', async () => {
        let submittedData = {
            email: "emailthatdoesntexist",
            password: validLoginData.password
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidCredentialsError",
            message: expect.any(String)
        }))

        submittedData = {
            email: validLoginData.email,
            password: "dfsgsrhsrthbthbrt"
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)


        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidCredentialsError",
            message: expect.any(String)
        }))
    })
    
})
