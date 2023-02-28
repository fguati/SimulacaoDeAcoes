const app = require('../../src/app.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../src/db/dbUtils.js')

beforeEach(() => {
    server = app.listen(0)
})

afterEach(() => {
    server.close()
})

describe('Testar GET em /user', () => {
    it('Deve retornar uma lista com pelo menos um elemento', async () => {
        const resposta = await request(server)
            .get('/user/')
            .set('Content-Type', 'application/json')
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody.length).toBeGreaterThan(0)
    })
})

describe('Test get by id in /user', () => {
    it('Must get a response with one user object', async () => {
        const id = 1
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            id: id,
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String)
        }))
    })

    it('must get an error 422 response from an invalid id', async () => {
        const id = 'asfdsadf'
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .expect(422)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            code: 'InvalidInputError',
            message: expect.any(String),
            listOfInvalidInputs: expect.any(Array)
        }))
    })
})

describe('Testar POST em /user', () => {   
    async function getObjId({ nome, email }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=?`;
        const result = await dbGet(sql, [nome, email])
    
        return result.id
    };

    it('must create an object in the the DB', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmailNovo@mail.com',
            senha: 'SenhaHashTeste'
        };
        
        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(201)

        const id = await getObjId(userObject)
        const dbObject = await UserDao.selectById(id)

        expect(dbObject).toEqual(expect.objectContaining({
            nome: userObject.nome,
            email: userObject.email
        }))

        await UserDao.delete(id)

    })

    it('must receive an error with invalid input if body is missing name', async () => {
        const userObject = {
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('nome')
    })

    it('must receive an error with invalid input if body is missing email', async () => {
        const userObject = {
            nome: 'TestObject',
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('email')
    })

    it('must receive an error with invalid input if body is missing senhaHash', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com'
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('senha')
    })

    it('must receive an error with invalid input if body has an invalid name', async () => {
        const userObject = {
            nome: null,
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('nome')
    })

    it('must receive an error with invalid input if body has an invalid email', async () => {
        const userObject = {
            nome: 'TestObject',
            email: null,
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('email')
    })

    it('must receive an error with invalid input if body has an invalid senhaHash', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senha: null
        };

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('senha')
    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'email@email.com',
            senha: 'SenhaHashTeste'
        };

        await UserDao.insert(userObject)

        const resposta = await request(server)
            .post('/user')
            .send(userObject)
            .expect(422)

        expect(resposta.body.uniqueColumn).toBe('email')

        const id = await getObjId(userObject)
        await UserDao.delete(id)
    })

    

})