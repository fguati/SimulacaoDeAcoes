const app = require('../../src/app.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../src/db/utils/dbutils.js')

beforeEach(() => {
    server = app.listen(0)
})

afterEach(() => {
    server.close()
})



describe('Testar POST em /register', () => {   
    async function getObjId({ username, email }) {
        let sql = `SELECT id FROM users WHERE username=? AND email=?`;
        const result = await dbGet(sql, [username, email])
        if(result){
            return result.id
        }

        return undefined
    };

    const exampleObj = {
        username: 'registerRouteTestHappy',
        email: 'registerroute@testhappy',
        password: 'testpassword'
    };

    it('must create an object in the the DB', async () => {
        const userObject = exampleObj
        
        const response = await request(server)
            .post('/register')
            .send(userObject)
            .expect(201)

        const id = await getObjId(userObject)
        const dbObject = await UserDao.selectById(id)

        expect(dbObject).toEqual(expect.objectContaining({
            username: userObject.username,
            email: userObject.email
        }))

    })

    it('must receive an error with invalid input if required info is missing or invalid', async () => {
        let userObject = {
            username: 'TestObject',
            password: 'passwordHashTeste'
        };

        let resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))
        
        userObject = {
            username: 'TestObject',
            email: 'TestEmail@mail.com'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('password'))

        userObject = {
            password: 'passwordHashTeste',
            email: 'TestEmail@mail.com'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('username'))

        userObject = {
            username: null,
            email: 'TestEmail@mail.com',
            password: 'passwordHashTeste'
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('username'))

        userObject = {
            username: 'TestObject',
            password: 'passwordHashTeste',
            email: null
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))
        
        userObject = {
            username: 'TestObject',
            email: 'TestEmail@mail.com',
            password: null
        };

        resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('password'))

    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const userObject = {
            username: 'RegisterUserRouteRepeatedEmailTest',
            email: 'registeruser@routerepeatedemail',
            password: '123'
        }

        const resposta = await request(server)
            .post('/register')
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text).aditionalInfo).toEqual(expect.stringContaining('email'))

    })

})