const server = require('../../src/server.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../src/db/dbUtils.js')
const { InvalidInputError } = require('../../src/CustomErrors')

afterEach(() => {
    server.close()
})

describe('Testar GET em /', () => {
    it('Deve retornar uma lista com pelo menos um elemento', async () => {
        const resposta = await request(server)
            .get('/')
            .set('Content-Type', 'application/json')
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody.length).toBeGreaterThan(0)
    })
})

describe('Testar POST em /', () => {   
    async function getObjId({ nome, email, senhaHash }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=? AND senhaHash=?`;
        const result = await dbGet(sql, [nome, email, senhaHash])
    
        return result.id
    };

    it('must create an object in the the DB', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };
        
        const resposta = await request(server)
            .post('/')
            .send(userObject)
            .expect(201)

        const id = await getObjId(userObject)
        const dbObject = await UserDao.selectById(id)

        expect(dbObject).toEqual(expect.objectContaining(userObject))

        await UserDao.delete(id)

    })

    it('must receive an error with invalid input if body is missing name', async () => {
        const userObject = {
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/')
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
            .post('/')
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
            .post('/')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('senhaHash')
    })

    it('must receive an error with invalid input if body has an invalid name', async () => {
        const userObject = {
            nome: null,
            email: 'TestEmail@mail.com',
            senhaHash: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/')
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
            .post('/')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('email')
    })

    it('must receive an error with invalid input if body has an invalid senhaHash', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senhaHash: null
        };

        const resposta = await request(server)
            .post('/')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('senhaHash')
    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'email@email.com',
            senhaHash: 'SenhaHashTeste'
        };

        await UserDao.insert(userObject)

        const resposta = await request(server)
            .post('/')
            .send(userObject)
            .expect(422)

        expect(resposta.body.uniqueColumn).toBe('email')

        const id = await getObjId(userObject)
        await UserDao.delete(id)
    })

    

})