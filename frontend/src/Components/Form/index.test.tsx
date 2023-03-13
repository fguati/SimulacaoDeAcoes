import { render, screen, fireEvent } from '@testing-library/react'
import IFormField from "Interfaces/IFormField"
import Form from '.'

describe('Testing the behavior of the form component', () => {
    const testFields: IFormField[] = [
        {
            name: 'test',
            type: 'text',
            value: 'test value'
        },
        {
            name: 'testEmail',
            type: 'email',
            value: 'test email value'
        },
        {
            name: 'password',
            type: 'password',
            value: 'test password value'
        },
    ]

    const mockOnSubmit = jest.fn()

    test('correct number of fields was rendered', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)
        
        const renderedFields = screen.queryAllByRole('InputField')
        expect(renderedFields.length).toBe(testFields.length)
    })

    test('all fields were rendered correctly', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)
        const renderedFields = screen.queryAllByRole('InputField')
        const renderedInputs = renderedFields.map(field => field.querySelector('input'))
        
        testFields.forEach((field) => {
            const wasRendered = renderedInputs.some(input => {
                return (input!.getAttribute('name') === field.name &&
                input!.getAttribute('type') === field.type &&
                input!.getAttribute('value') === field.value)
            })

            expect(wasRendered).toBe(true)
        })
    })

    test('onSubmit function must be called when button is clicked', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)
        expect(mockOnSubmit).toBeCalledTimes(1)
    })

    test('form is cleared when button is clicked', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)

        const fields = screen.queryAllByRole('InputField')
        const inputs = fields.map(field => field.querySelector('input'))
        const button = screen.getByRole('button')
        fireEvent.click(button)

        inputs.forEach(input => {
            const inputValue = input!.getAttribute('value')
            expect(inputValue).toBe('')
        })
    })
})