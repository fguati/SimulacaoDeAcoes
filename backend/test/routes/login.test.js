const app = require('../../src/app.js')
const request = require('supertest')
const UserDAO = require('../../src/db/ComunicationDB/user.js')

beforeEach(() => {
    server = app.listen(0)
})

afterEach(() => {
    server.close()
})

describe('Test /login route', () => {
        
    it('must return an status 200 for a valid credentials', async () => {
        const submittedData = {
            nome: "exampleName",
            email: "algumExemplo3",
            senha: "asdasfsa32"
        }
        
        try {
            const exampleEmailinDB = await UserDAO.selectByEmail(submittedData.email)
        } catch (error) {
            await UserDAO.insert(submittedData)
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(200)
    })

    it('must return an error response if receives an invalid email', async () => {
        const submittedData = {
            email: null,
            senha: "asdasfsa32"
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })

    it('must return an error response if receives an invalid password', async () => {
        const submittedData = {
            email: "algumExemplo3",
            senha: null
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })

    it('must return an error response if does not receive an email', async () => {
        const submittedData = {
            senha: "asdasfsa32"
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })

    it('must return an error response if does not receive a password', async () => {
        const submittedData = {
            email: "algumExemplo3"
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(422)
        
        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidInputError",
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })

    it('must return an error if receives an email that does not exist', async () => {
        const submittedData = {
            email: "emailthatdoesntexist",
            senha: "asdasfsa32"
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(401)

        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidCredentialsError",
            message: expect.any(String)
        }))
    })

    it('must return an error if receives a password that doesnt exist', async () => {
        const submittedData = {
            email: "algumExemplo3",
            senha: "dfsgsrhsrthbthbrt"
        }
        
        const resposta = await request(server)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(submittedData)
            .expect(401)

        expect(resposta.body).toEqual(expect.objectContaining({
            code: "InvalidCredentialsError",
            message: expect.any(String)
        }))
    })
    
})
