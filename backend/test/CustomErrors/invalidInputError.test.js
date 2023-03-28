const { InvalidInputError } = require('../../src/CustomErrors')

describe('Unit tests of the InvalidInputError class', () => {
    
    it('must have name attribute that is InvalidInputError with attributes message and invalidInputList received from constructor', () => {
        const message = 'Test message'
        const inputList = ['test invalid input']
        const erroTeste = new InvalidInputError(message, inputList)
        
        expect(erroTeste).toBeInstanceOf(Error)
        expect(erroTeste.name).toBe('InvalidInputError')
        expect(erroTeste).toEqual(expect.objectContaining({
            message: expect.any(String),
            aditionalInfo: expect.stringContaining(`${inputList}`)
        }))

    })

})