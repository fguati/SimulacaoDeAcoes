import IFormField from "Interfaces/IFormField"
import { emailFieldIsCorrectlyFormatted, fieldIsNotEmpty, entederedValueIsWithinLength } from ".."

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

    test('Email validator should return false if email does not have correct format', () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'email',
            value: 'notEmail'
        }

        let testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = 'notEmail@stillNotEmail'
        testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = 'notEmail@stillNotEmail.'
        testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = 'notEmail.com'
        testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = 'notEmail.com.br'
        testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = 'notEmail.com.com'
        testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))
    })

    test('Email validator should return true if email has correct format', () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'email',
            value: 'valid@email.com'
        }

        let testResult = emailFieldIsCorrectlyFormatted(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toEqual(undefined)
    })

    test("Length validator must return false if checked value's length is out the defined range", () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'text',
            value: 'ab'
        }

        let lengthRange: {minLength?:number, maxLength?: number} = {minLength: 3, maxLength: 20}
        let testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        lengthRange = {minLength: 3}
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        testField.value = '123456789012345678900'
        lengthRange = {minLength: 3, maxLength: 20}
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))

        lengthRange = {maxLength: 20}
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(false)
        expect(testResult.message).toEqual(expect.any(String))
    })

    test("Length validator must return true if checked value's length is out the defined range", () => {
        const testField: IFormField = {
            name: 'Test Field',
            type: 'text',
            value: 'abc'
        }

        let lengthRange: {minLength?:number, maxLength?: number} = {minLength: 3, maxLength: 20}
        let testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toEqual(undefined)

        lengthRange = {minLength: 3}
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toEqual(undefined)
        
        lengthRange = {minLength: 3, maxLength: 20}
        testField.value = '12345678901234567890'
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toEqual(undefined)
        
        lengthRange = {maxLength: 20}
        testResult = entederedValueIsWithinLength(lengthRange)(testField.value)

        expect(testResult.valid).toBe(true)
        expect(testResult.message).toEqual(undefined)
    })
})