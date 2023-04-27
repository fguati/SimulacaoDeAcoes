import IFormField from "Interfaces/IFormField"
import { FormValidator } from "utils/FormValidators"
import { formIsValid } from "../validateForm"

describe('Test the function that does the field validation', () => {
    const testValidatorFailed: FormValidator = (field) => {
        return false
    }
    const testValidatorApproved: FormValidator = (field) => {
        return true
    }

    const testListOfFormFields: IFormField[] = [
        {
            name: 'testName 1',
            type: 'text',
            value: 'test value 1'
        },
        {
            name: 'testName 2',
            type: 'text',
            value: 'test value 2'
        },
        {
            name: 'testName 3',
            type: 'text',
            value: 'test value 3'
        },
        
    ]

    
    it('Returns false if receives a list of fields where at least one field is invalid', () => {
        testListOfFormFields[0].validators = [testValidatorFailed]

        const fieldsAreInvalid = formIsValid(testListOfFormFields)

        expect(fieldsAreInvalid).toBe(false)
    })

    it('Returns false if receives a list of fields where all fields are invalid', () => {
        testListOfFormFields.forEach(field => {
            field.validators = [testValidatorFailed]
        })

        const fieldsAreInvalid = formIsValid(testListOfFormFields)

        expect(fieldsAreInvalid).toBe(false)

    })

    it('Returns true if receives a list of fields where all fields are valid, including fields with no validators', () => {
        testListOfFormFields.forEach(field => {
            field.validators = [testValidatorApproved]
        })

        testListOfFormFields[0].validators = []

        const fieldsAreInvalid = formIsValid(testListOfFormFields)

        expect(fieldsAreInvalid).toBe(true)
    })
})