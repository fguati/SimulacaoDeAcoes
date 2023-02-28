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

describe('Testar POST em /register', () => {   
    async function getObjId({ nome, email }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=?`;
        const result = await dbGet(sql, [nome, email])
    
        return result.id
    };

    it('must create an object in the the DB', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail1@mail.com',
            senha: 'SenhaHashTeste'
        };
        
        const resposta = await request(server)
            .post('/register')
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
            senha: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('nome')
    })

    it('must receive an error with invalid input if body is missing email', async () => {
        const userObject = {
            nome: 'TestObject',
            senha: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('email')
    })

    it('must receive an error with invalid input if body is missing senha', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com'
        };

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('senha')
    })

    it('must receive an error with invalid input if body has an invalid name', async () => {
        const userObject = {
            nome: null,
            email: 'TestEmail@mail.com',
            senha: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('nome')
    })

    it('must receive an error with invalid input if body has an invalid email', async () => {
        const userObject = {
            nome: 'TestObject',
            email: null,
            senha: 'SenhaHashTeste'
        };

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.listOfInvalidInputs[0]).toBe('email')
    })

    it('must receive an error with invalid input if body has an invalid senha', async () => {
        const userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senha: null
        };

        const resposta = await request(server)
            .post('/register')
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
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(resposta.body.uniqueColumn).toBe('email')

        const id = await getObjId(userObject)
        await UserDao.delete(id)
    })

    

})