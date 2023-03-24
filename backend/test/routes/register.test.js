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
        if(result){
            return result.id
        }

        return undefined
    };

    const exampleObj = {
        nome: 'TestObject',
        email: 'TestEmail1@mail.com',
        senha: 'SenhaHashTeste'
    };

    beforeEach(async () => {
        const id = await getObjId(exampleObj)
        if(id) {
            await UserDao.delete(id)

        }

    })

    it('must create an object in the the DB', async () => {
        const userObject = exampleObj
        
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

    it('must receive an error with invalid input if required info is missing or invalid', async () => {
        let userObject = {
            nome: 'TestObject',
            senha: 'SenhaHashTeste'
        };

        let resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))
        
        userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('senha'))

        userObject = {
            senha: 'SenhaHashTeste',
            email: 'TestEmail@mail.com'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('nome'))

        userObject = {
            nome: null,
            email: 'TestEmail@mail.com',
            senha: 'SenhaHashTeste'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('nome'))

        userObject = {
            nome: 'TestObject',
            senha: 'SenhaHashTeste',
            email: null
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))
        
        userObject = {
            nome: 'TestObject',
            email: 'TestEmail@mail.com',
            senha: null
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('senha'))

    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const userObject = exampleObj

        await UserDao.insert(userObject)

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))

        const id = await getObjId(userObject)
        await UserDao.delete(id)
    })

})