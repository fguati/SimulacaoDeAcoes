const app = require('../../src/app.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet } = require('../../src/db/utils/dbutils.js')

const validCredentials = {
    username: "validLoginUser",
    email: "validlogin@user",
    password: "123"
}

const testObjectToBePosted = {
    username: 'userToTestPOSTRoute',
    email: 'postuser@routetest',
    hashed_password: '123',
    salt: 'testSalt'
};

let testObjectWithInvalidFields = {
    username: 'userToTestPOSTRouteWithInvalidFields',
    email: 'postuserwinvalidfields@routetest',
    hashed_password: '123',
    salt: 'testSalt'
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

describe('Integration tests of the GET method in the /user route', () => {

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
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
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

describe('Integration test of GET method in /user/:id route', () => {
    
    it('Must get a response with one user object', async () => {
        const authToken = await login()
        const id = 5
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            id: id,
            username: validCredentials.username,
            email: validCredentials.email,
            hashed_password: expect.any(String)
        }))
    })

    it('must get an error 422 response from an invalid id', async () => {
        const authToken = await login()
        const id =`thisiddoesntexist`
        
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
        const id = 5

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

describe('Testar POST em /user', () => {   
    
    async function getObjId({ username, email }) {
        let sql = `SELECT id FROM users WHERE username=? AND email=?`;
        const result = await dbGet(sql, [username, email])
    
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
            username: testObjectToBePosted.username,
            email: testObjectToBePosted.email,
            hashed_password: expect.any(String),
            salt: expect.any(String)
        }))

    })

    it('must receive an error with invalid input if a mandatory info is either missing or invalid', async () => {
        const authToken = await login()
        
        let userObject = {
            email: testObjectWithInvalidFields.email,
            hashed_password: testObjectWithInvalidFields.hashed_password,
            salt: testObjectWithInvalidFields.salt
        };

        let resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        userObject = {
            username: testObjectWithInvalidFields.username,
            hashed_password: testObjectWithInvalidFields.hashed_password,
            salt: testObjectWithInvalidFields.salt
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
            username: testObjectWithInvalidFields.username,
            email: testObjectWithInvalidFields.email,
            salt: testObjectWithInvalidFields.salt
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))

        userObject = {
            username: null,
            email: testObjectWithInvalidFields.email,
            hashed_password: testObjectWithInvalidFields.hashed_password,
            salt: testObjectWithInvalidFields.salt
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        userObject = {
            username: testObjectWithInvalidFields.username,
            email: null,
            hashed_password: testObjectWithInvalidFields.hashed_password,
            salt: testObjectWithInvalidFields.salt
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
            username: testObjectWithInvalidFields.username,
            email: testObjectWithInvalidFields.email,
            hashed_password: null,
            salt: testObjectWithInvalidFields.salt
        };

        resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(userObject)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))
    })

    it('must receive an error with invalid input if body has a repeated email', async () => {
        const authToken = await login()
        const repeatedEmailUser = {
            username: 'POSTuserRouteRepeatedEmailTest',
            email: 'postuser@routerepeatedemail.test',
            hashed_password: '123',
            salt: 'testSalt'
        }
        
        const resposta = await request(server)
            .post('/user')
            .set('Cookie', authToken)
            .send(repeatedEmailUser)
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name:'UniqueConstraintError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

    })

})