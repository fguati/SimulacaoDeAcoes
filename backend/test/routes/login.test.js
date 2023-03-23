const app = require('../../src/app.js')
const request = require('supertest')
const JWToken = require('../../src/services/tokens.js')
const { dbGet, dbRun } = require('../../src/db/dbUtils.js')


beforeEach(() => {
    server = app.listen(0)
    process.env.JWT_KEY = 'testKey'
})

afterEach(() => {
    server.close()
})

describe('Test /login route', () => {
    async function setUpExampleUser(submittedData) {
        try {
            const exampleEmailinDB = await dbGet(`SELECT * from users WHERE email=?`, [submittedData.email])
        } catch (error) {
            await dbRun(`INSERT INTO users (nome, email, senhaHash) VALUES (?, ?, ?)`, [submittedData.nome, submittedData.email, submittedData.senha])
        }

    }

    async function getResponse(server, submittedData) {
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
        
        return resposta
    }
    

    it('must return an status 200 and the correct JWT authToken for a valid credentials', async () => {
        const submittedData = {
            nome: "exampleName",
            email: "algumExemplo3",
            senha: "asdasfsa32"
        }
        
        const token = JWToken.generate(submittedData)
        const JWT = token
        
        await setUpExampleUser(submittedData)
        
        const resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(200)

        expect(resposta.text).toBe(JWT)
        
    })

    it('must return an error response if receives an invalid field', async () => {
        let submittedData = {
            email: null,
            senha: "asdasfsa32"
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))

        submittedData = {
            email: "algumExemplo3",
            senha: null
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))

        submittedData = {
            email: "algumExemplo3"
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))

        submittedData = {
            senha: "asdasfsa32"
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(422)

        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })

    it.skip('must return an error if receives an email or password that does not exist', async () => {
        let submittedData = {
            email: "emailthatdoesntexist",
            senha: "asdasfsa32"
        }
        
        let resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)

        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidCredentialsError",
            message: expect.any(String)
        }))

        submittedData = {
            email: "algumExemplo3",
            senha: "dfsgsrhsrthbthbrt"
        }
        
        resposta = await getResponse(server, submittedData)
        expect(resposta.status).toBe(401)


        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidCredentialsError",
            message: expect.any(String)
        }))
    })
    
})
