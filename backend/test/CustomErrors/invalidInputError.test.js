const { InvalidInputError } = require('../../src/CustomErrors')

describe('Test the InvalidInputError class', () => {
    const message = 'Test message'
    const inputList = ['test invalid input']
    const erroTeste = new InvalidInputError(message, inputList)
    
    it('must instantiate an error object', () => {
        expect(erroTeste).toBeInstanceOf(Error)
    })

    it('must have name attribute that is InvalidInputError', () => {

        expect(erroTeste.name).toBe('InvalidInputError')
    })

    it('must have attributes message and invalidInputList received from constructor', () => {
        expect(erroTeste).toEqual(expect.objectContaining({
            message: expect.any(String),
            InvalidInputList: expect.any(Array)
        }))
    })
})