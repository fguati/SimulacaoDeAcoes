import { render, screen } from "@testing-library/react"
import InputField from "."
import IInputFieldProps from "./IInputFieldProps"
import '@testing-library/jest-dom'

describe('testing the Input Field Component', () => {
    const testProps: IInputFieldProps = {
        currentValue: '',
        name: 'testName',
        setValue: jest.fn(),
        inputType:"text",
        children: 'exampleChildAttribute'
    }

    const childrenByElement = 'Example Child in react'
    
    beforeEach(() => {
        render(
            <InputField {...testProps}>
                {childrenByElement}
            </InputField>
        )

    })
    
    test('must render a label and input correctly', () => {
        const field = screen.getByRole('InputField')
        const input = field.querySelector('input')
        const label = field.querySelector('label')

        expect(input).toHaveAttribute('value', testProps.currentValue)
        expect(input).toHaveAttribute('type', testProps.inputType)
        expect(input).toHaveAttribute('name', testProps.name)

    })
})