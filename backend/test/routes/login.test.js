const app = require('../../src/app.js')
const request = require('supertest')
const JWToken = require('../../src/services/tokens.js')
const { dbGet, dbRun } = require('../../src/db/dbUtils.js')
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
    
    const exampleData = {
        nome: "exampleName",
        email: "algumExemplo3",
        senha: "asdasfsa32"
    }
    
    beforeAll(async () => {
        try {
            await UserDAO.insert(exampleData) //Used the UserDAO class because it already hashes the password. Errors in the class will cause errors in the test
        } catch (error) {}

    })

    afterAll(async () => {
        try {
            await dbRun(`DELETE FROM users WHERE email=?`, [exampleData.email])

        } catch (error) {}
    })

    it('must return an status 200 and the correct JWT authToken for a valid credentials', async () => {
        const submittedData = exampleData
        
        const token = JWToken.generate(submittedData)
        const JWT = token
        
        
        const resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(200)

        expect(JSON.parse(resposta.text)['authToken']).toBe(JWT)
        
    })

    it('must return an error response if receives an invalid field', async () => {
        let submittedData = {
            email: null,
            senha: exampleData.senha
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            email: exampleData.email,
            senha: null
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            email: exampleData.email
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidInputError",
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))

        submittedData = {
            senha: exampleData.senha
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
            senha: exampleData.senha
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidCredentialsError",
            message: expect.any(String)
        }))

        submittedData = {
            email: exampleData.email,
            senha: "dfsgsrhsrthbthbrt"
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)


        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: "InvalidCredentialsError",
            message: expect.any(String)
        }))
    })
    
})
