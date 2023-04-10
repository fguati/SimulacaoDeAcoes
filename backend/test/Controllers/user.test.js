const UserController = require("../../src/controllers/user");
const UserDAO = require("../../src/db/ComunicationDB/user");
const { dbGet, dbRun } = require("../../src/db/utils/dbutils");
const { createMocks } = require('node-mocks-http');


const validCredentials = {
    username:'Testget',
    email:'test@get',
    password:'123'
}

const userToBePosted = {
    username: 'TestPostUserController',
    email: 'postuser@controller',
    hashed_password: '123',
    salt:'123'
}

function mockReqResNext() {
    const { req, res } = createMocks();
    req.body = {...validCredentials}
    res.status = (code) => {
        res.statusCode = code    
        return res
    }
    res.send = (body) => {
        res.body = body
        return res
    }
    res.headers = {}
    res.setHeader = (header, value) => {
        res.headers[header] = value
        return res
    }
    res.set = res.setHeader

    const next = jest.fn(param => param)

    return {req, res, next}
}

describe('test the getAll method of the UserController', () => {
    it('returns a non empty list of users', async () => {
        const {req, res, next} = mockReqResNext()
        
        const response = await UserController.getAll(req, res, next)
        const userList = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(userList).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String),
    
        })]))

    })
})

describe('test getOneById method of the UserController', () => {
    it('returns a user if a valid Id is entered', async () => {
        const {req, res, next} = mockReqResNext()

        req.params.id = 1

        const response = await UserController.getOneById(req, res, next)
        const user = JSON.parse(response.body)

        expect(response.statusCode).toBe(200)
        expect(user).toEqual(expect.objectContaining({
            id: 1,
            username: expect.any(String),
            email: expect.any(String),
            hashed_password: expect.any(String),
            salt: expect.any(String),
        }))
    })

    it('must return an invalid input error response if id is invalid', async () => {
        const {req, res, next} = mockReqResNext()

        req.params.id = 0

        const invalidInputError = await UserController.getOneById(req, res, next)

        expect(next).toBeCalledWith(invalidInputError)
        expect(invalidInputError.statusCode).toBe(422)
        expect(invalidInputError).toEqual(expect.objectContaining({
            name:'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('id')
        }))
    })

})

describe('test the postUser method of the user controller', () =>{
    
    it('must insert a user in the db', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = userToBePosted

        const response = await UserController.postUser(req, res, next)
        expect(response.statusCode).toBe(201)
        const userInDb = await UserDAO.selectByEmail(userToBePosted.email)

        expect(userInDb).toEqual(expect.objectContaining({
            email: userToBePosted.email,
            username: userToBePosted.username,
            hashed_password: userToBePosted.hashed_password,
            salt: userToBePosted.salt
        }))

    })

    it('must return invalid input error response if receive an invalid value for either name, email or password', async () => {
        const { req, res, next } = mockReqResNext()
        req.body = userToBePosted
        req.body.email = 'email@notinDB'

        //empty email
        req.body.email = ''
        let invalidError = await UserController.postUser(req, res, next)
         
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = 'email@notinDB'

        //empty name
        req.body.username = ''
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        req.body.username = userToBePosted.username
        
        //empty hashed_password
        req.body.hashed_password = ''
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))

        req.body.hashed_password = userToBePosted.hashed_password
        
        //invalid email
        req.body.email = null
        invalidError = await UserController.postUser(req, res, next)
        
        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

        req.body.email = 'email@notinDB'

        //invalid name
        req.body.username = null
        invalidError = await UserController.postUser(req, res, next)
         

        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('username')
        }))

        req.body.username = userToBePosted.username
        
        //invalid password
        req.body.hashed_password = null
        invalidError = await UserController.postUser(req, res, next)
         

        expect(invalidError.statusCode).toBe(422)
        expect(invalidError).toEqual(expect.objectContaining({
            name: 'InvalidInputError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('hashed_password')
        }))

        req.body.hashed_password = userToBePosted.hashed_password
    })

    it('must return an unique constraint error if email already exists in db', async () => {

        const { req, res, next } = mockReqResNext()
        req.body['hashed_password'] = req.body.password
        req.body.salt = '123'
        const uniqueConstraintError = await UserController.postUser(req, res, next)
        expect(uniqueConstraintError.statusCode).toBe(422)
        expect(uniqueConstraintError).toEqual(expect.objectContaining({
            name: 'UniqueConstraintError',
            message: expect.any(String),
            aditionalInfo: expect.stringContaining('email')
        }))

    })
})