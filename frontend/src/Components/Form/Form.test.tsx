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

    function inputRenderedCorrectly(input:HTMLInputElement | null, field: IFormField) {
        return (input!.getAttribute('name') === field.name &&
                input!.getAttribute('type') === field.type &&
                input!.getAttribute('value') === field.value)
    }

    test('all fields were rendered correctly', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)
        const renderedFields = screen.queryAllByRole('InputField')
        const renderedInputs = renderedFields.map(field => field.querySelector('input'))
        
        testFields.forEach((field) => {
            const wasRendered = renderedInputs.some(input => {
                return inputRenderedCorrectly(input, field)
            })

            expect(renderedFields.length).toBe(testFields.length)  
            expect(wasRendered).toBe(true)
        })
    })

    test('onSubmit function must be called, form cleared and page must not refresh when button is clicked', () => {
        render(<Form fields = {testFields} onSubmit = {mockOnSubmit} />)

        const button = screen.getByRole('button')
        const fields = screen.queryAllByRole('InputField')
        const inputs = fields.map(field => field.querySelector('input'))

        fireEvent.click(button)

        expect(mockOnSubmit).toBeCalledTimes(1)
        inputs.forEach(input => {
            const inputValue = input!.getAttribute('value')
            expect(inputValue).toBe('')
        })
    })

    test('changing the values of a field actually changes their value', () => {
        render(<Form fields={testFields} onSubmit={mockOnSubmit}/>)

        const renderedFields = screen.queryAllByRole('InputField')
        const renderedInputs = renderedFields.map(field => field.querySelector('input'))
        
        const newValueA = 'a'
        const newValueB = 'b'

        renderedInputs.forEach(input => {
            fireEvent.change(input!, {target: {value: newValueA}})
            expect(input?.value).toBe(newValueA)
            fireEvent.change(input!, {target: {value: newValueB}})
            expect(input?.value).toBe(newValueB)
        })
    })

})