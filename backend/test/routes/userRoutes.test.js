const app = require('../../src/app.js')
const request = require('supertest')
const UserDao = require('../../src/db/ComunicationDB/user.js')
const { dbGet, dbAll } = require('../../src/db/utils/dbutils.js')
const { authTokenDurationInSec } = require('../../src/utils/globalVariables.js')

const validAmindCredentials = {
    username: "admin",
    email: "admim@admin.com",
    password: "*Aa12345678"
}

const validClientCredentials ={
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

const testUserUnauthorized = {
    username: 'testUserUnauthorized',
    email: 'testUserUnauthorized@unauthorized',
    hashed_password: '123',
    salt: 'testSalt'
};

let testObjectWithInvalidFields = {
    username: 'userToTestPOSTRouteWithInvalidFields',
    email: 'postuserwinvalidfields@routetest',
    hashed_password: '123',
    salt: 'testSalt'
};

let server;

async function login(credentials) {
    
    const resposta = await request(server).post('/login').send(credentials)
    const authToken = resposta.headers['set-cookie']
    return authToken
}

async function testUnauthorizedError(route, body = {}, method='get') {
    const authToken = await login(validClientCredentials)
        const resposta = await request(server)[method](route)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .send(body)
            .expect(403)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'UnauthorizedError',
            message: expect.any(String)
        }))
}

beforeEach(async () => {
    server = app.listen(0)
})

afterEach(() => {
    server.close()
})

describe('Integration tests of the GET method in the /user route', () => {

    it('Must return an list with at least one user', async () => {
        const authToken = await login(validAmindCredentials)

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

    it('Must return an UnauthorizedError error if it is not admin', async () => {
        await testUnauthorizedError('/user/')
    })
})

describe('Integration test of GET method in /user/:id route', () => {
    
    it('Must get a response with one user object', async () => {
        const authToken = await login(validAmindCredentials)
        const id = 28
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            id: id,
            username: validAmindCredentials.username,
            email: validAmindCredentials.email,
            hashed_password: expect.any(String)
        }))
    })

    it('must get an error 404 response from an invalid id', async () => {
        const authToken = await login(validAmindCredentials)
        const id =`thisiddoesntexist`
        
        const resposta = await request(server)
            .get(`/user/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(404)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'NotFoundError',
            message: expect.any(String)
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

    it('Must return an UnauthorizedError error if it is not admin', async () => {
        const id = 5
        await testUnauthorizedError(`/user/${id}`)
    })
})

describe('Testar POST em /user', () => {   
    
    async function getObjId({ username, email }) {
        let sql = `SELECT id FROM users WHERE username=? AND email=?`;
        const result = await dbGet(sql, [username, email])
    
        return result.id
    }

    it('must create an object in the the DB', async () => {
        const authToken = await login(validAmindCredentials)
        
        await request(server)
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
        const authToken = await login(validAmindCredentials)
        
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
        const authToken = await login(validAmindCredentials)
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

    it('Must return an UnauthorizedError error if it is not admin', async () => {
        await testUnauthorizedError(`/user`, testUserUnauthorized, 'post')
    })


})

describe('Integration tests of the /user/depostit route', () => {

    const testUserCredentials = {
        username: "testDepositFundsRoute",
        email: "depositFunds@routeTest.com",
        password: "aA*12345678"
    }

    const loginDeposit = async () => {
        const resposta = await request(server).post('/login').send(testUserCredentials)
        const authToken = resposta.headers['set-cookie']
        return authToken
    }

    it('must return a success response with the balance in its body', async () => {
        
        const authToken = await loginDeposit()
        const valueToDeposit = 200
        const valueToWithdraw = -100

        let resposta = await request(server)
            .post(`/user/deposit`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .send({ funds: valueToDeposit })
            .expect(200)
        let parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            balance: valueToDeposit
        }))

        resposta = await request(server)
            .post(`/user/deposit`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .send({ funds: valueToWithdraw })
            .expect(200)
        parsedBody = JSON.parse(resposta.text)
        expect(parsedBody).toEqual(expect.objectContaining({
            balance: valueToDeposit + valueToWithdraw
        }))


    })

    it('must return a failure response if the funds to be moved were not sent or had invalid value', async () => {
        const authToken = await loginDeposit()

        let resposta = await request(server)
            .post('/user/deposit')
            .set('Cookie', authToken)
            .send({})
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))

        resposta = await request(server)
            .post('/user/deposit')
            .set('Cookie', authToken)
            .send({funds: 'null'})
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))
    })

    it('must return a failure response if the move would lead to negative balance', async () => {
        const authToken = await loginDeposit()
        const invalidWithdraw = -10000000000

        let resposta = await request(server)
            .post('/user/deposit')
            .set('Cookie', authToken)
            .send({ funds: invalidWithdraw })
            .expect(422)

        expect(JSON.parse(resposta.text)).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('funds')
        }))
    })

    it('must return a MissingAuthTokenError error if it is not authenticated', async () => {
        const depositValue = 500

        let resposta = await request(server)
            .post('/user/deposit')
            .set('Cookie', 'invalidToken')
            .send({ funds: depositValue })
            .expect(401)

        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.any(String)
        }))
    })

    it('must return a failure response if it is authToken is expired', async () => {
        jest.useFakeTimers();
        const authToken = await loginDeposit()
        jest.advanceTimersByTime(authTokenDurationInSec * 1000 + 1)
        const valueToDeposit = 200

        let resposta = await request(server)
            .post(`/user/deposit`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .send({ funds: valueToDeposit })
            .expect(401)
        
        let parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'TokenExpiredError',
            message: expect.any(String)
        }))
    })

})

describe('Integration tests of the /user/portfolio route', () => {
    const testUserWithPortfolio = {
        username: "userToTestGetPortFolio",
        email: "UserControler@getportfolio.com",
        password: "*Aa12345678"
    }

    const testUserWithoutStocks = {
        username: "userWithNoStocks",
        email: "user@withnostocks.email",
        password: "123"
    }

    const loginGetPortfolio = async (credentials) => {
        const resposta = await request(server).post('/login').send(credentials)
        const authToken = resposta.headers['set-cookie']
        return authToken
    }
    
    it('must return ok response with user portfolio in its body', async () =>{
        const authToken = await loginGetPortfolio(testUserWithPortfolio)
        const dbPortfolio = await dbAll(`SELECT * FROM stock_positions WHERE user_id=?`, [26])
        
        const resposta = await request(server)
            .get(`/user/portfolio`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        
        const parsedBody = JSON.parse(resposta.text)
        parsedBody.forEach(position => {
            const { stock_ticker, stock_qty, stock_avg_price } = dbPortfolio.find(dbPosition => dbPosition.stock_ticker === position.stockTicker) //expected position gotten from db
            
            expect(position).toEqual(expect.objectContaining({
                userId: 26,
                stockTicker: stock_ticker,
                qty: stock_qty, 
                averagePrice: stock_avg_price
            }))
        })
    })

    it('must return ok response with an empty list in its body if user has no stocks', async () => {
        const authToken = await loginGetPortfolio(testUserWithoutStocks)
        
        const resposta = await request(server)
            .get(`/user/portfolio`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(200)
        
        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual([])
    })

    it('must return an MissingAuthTokenError error if it is not authenticated', async () => {
        let resposta = await request(server)
            .get(`/user/portfolio`)
            .set('Content-Type', 'application/json')
            .expect(401)

        const parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'MissingAuthTokenError',
            message: expect.any(String)
        }))
    })

    it('must return a failure response if it is authToken is expired', async () => {
        jest.useFakeTimers();
        const authToken = await loginGetPortfolio(testUserWithPortfolio)
        jest.advanceTimersByTime(authTokenDurationInSec * 1000 + 1)

        let resposta = await request(server)
            .get(`/user/portfolio`)
            .set('Content-Type', 'application/json')
            .set('Cookie', authToken)
            .expect(401)
        
        let parsedBody = JSON.parse(resposta.text)

        expect(parsedBody).toEqual(expect.objectContaining({
            name: 'TokenExpiredError',
            message: expect.any(String)
        }))
    })

})
