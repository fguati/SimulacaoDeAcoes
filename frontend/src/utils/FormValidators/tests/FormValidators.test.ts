import IFormField from "Interfaces/IFormField"
import { fieldIsNotEmpty } from ".."

describe('Unit tests of the form validator functions', () => {
    
    test('Validator that checks if form fields are not empty should return false if receives an empty field', () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'text',
            value: ''
        }

        const testResult = fieldIsNotEmpty(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))
    })

    test('Validator that checks if form fields are not empty should return true if receives a filled field', () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'text',
            value: 'value'
        }

        const testResult = fieldIsNotEmpty(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toBe(undefined)

    })
})