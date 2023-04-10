const app = require('../../src/app.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../src/db/utils/dbutils.js')

const validCredentials = {
    nome: "exampleName",
    email: "algumExemplo3",
    senha: "asdasfsa32"
}

const testObjectToBePosted = {
    nome: 'TestObject',
    email: 'TestEmailNovo@mail.com',
    senha: 'SenhaHashTeste'
};

async function login() {
    
    const resposta = await request(server).post('/login').send(validCredentials)
    const authToken = resposta.headers['set-cookie']
    return authToken
}

beforeEach(async () => {
    server = app.listen(0)
})

afterEach(() => {
    server.close()
})

describe.skip('Testar GET em /user', () => {
    beforeAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(!user) {
            await UserDao.insert(validCredentials)
    
        }
        
    })
    
    afterAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(user) {
            await UserDao.delete(user.id)
    
        }
    })

    it('Must return an list with at least one user', async () => {
        const authToken = await login()

        const resposta = await request(server)
            .get('/user/')
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody.length).toBeGreaterThan(0)
        expect(parsedBody[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            nome: expect.any(String),
            email: expect.any(String),
            senhaHash: expect.any(String),
            salt: expect.any(String)
        }))
    })

    it('Must return an MissingAuthTokenError error if it is not authenticated', async () => {
        const resposta = await request(server)
            .get('/user/')
            .set('Content-Type', 'application/json')
            .expect(401)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.any(String)
        }))
    })
})

describe.skip('Test get by id in /user', () => {
    beforeAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(!user) {
            await UserDao.insert(validCredentials)
    
        }
        
    })
    
    afterAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(user) {
            await UserDao.delete(user.id)
    
        }
    })
    
    it('Must get a response with one user object', async () => {
        const authToken = await login()
        const user = await UserDao.selectByEmail(validCredentials.email)
        const id = user.id
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            id: id,
            nome: validCredentials.nome,
            email: validCredentials.email,
            senhaHash: expect.any(String)
        }))
    })

    it('must get an error 422 response from an invalid id', async () => {
        const authToken = await login()
        const user = await UserDao.selectByEmail(validCredentials.email)
        const id =` ${user.id}thisiddoesntexist`
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(422)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.any(String)
        }))
    })

    it('Must return an MissingAuthTokenError error if it is not authenticated', async () => {
        const user = await UserDao.selectByEmail(validCredentials.email)
        const id = user.id

        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .expect(401)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.any(String)
        }))
    })
})

describe.skip('Testar POST em /user', () => {   
    beforeAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(!user) {
            await UserDao.insert(validCredentials)
    
        }
        
    })
    
    afterAll(async () => {
        const user = await dbGet(`SELECT * FROM users WHERE email=?`, [validCredentials.email])
        if(user) {
            await UserDao.delete(user.id)
    
        }
    })
    
    async function getObjId({ nome, email }) {
        let sql = `SELECT id FROM users WHERE nome=? AND email=?`;
        const result = await dbGet(sql, [nome, email])
    
        return result.id
    };

    it('must create an object in the the DB', async () => {
        const authToken = await login()
        
        const resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(testObjectToBePosted)
            .expect(201)

        const id = await getObjId(testObjectToBePosted)
        const dbObject = await UserDao.selectById(id)

        expect(dbObject).toEqual(expect.objectContaining({
            nome: testObjectToBePosted.nome,
            email: testObjectToBePosted.email
        }))

        await UserDao.delete(id)

    })

    it('must receive an error with invalid input if a mandatory info is either missing or invalid', async () => {
        const authToken = await login()
        
        let userObject = {
            email: testObjectToBePosted.email,
            senhaHash: testObjectToBePosted.senha
        };

        let resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('nome')
        }))

        userObject = {
            nome: testObjectToBePosted.nome,
            senhaHash: testObjectToBePosted.senha
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        userObject = {
            nome: testObjectToBePosted.nome,
            email: testObjectToBePosted.email
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))

        userObject = {
            nome: null,
            email: testObjectToBePosted.email,
            senhaHash: testObjectToBePosted.senha
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('nome')
        }))

        userObject = {
            nome: testObjectToBePosted.nome,
            email: null,
            senhaHash: testObjectToBePosted.senha
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        userObject = {
            nome: testObjectToBePosted.nome,
            email: testObjectToBePosted.email,
            senhaHash: null
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('senha')
        }))
    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const authToken = await login()
        
        const resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(validCredentials)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name:'UniqueConstraintError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

    })

})