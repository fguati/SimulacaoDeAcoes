import { render, screen } from "@testing-library/react"
import InputField from "."
import IInputFieldProps from "./IInputFieldProps"
import '@testing-library/jest-dom'

describe('testing the Input Field Component', () => {
    const testProps: IInputFieldProps = {
        currentValue: 'testValue',
        name: 'testName',
        setValue: jest.fn(),
        inputType:"text",
        children: 'exampleChildAttribute'
    }

    const childrenByElement = 'Example Child in react'
        
    test('must render a label and input correctly', () => {
        render(
            <InputField {...testProps}>
                {childrenByElement}
            </InputField>
        )

        const field = screen.getByRole('InputField')
        const input = screen.getByDisplayValue(testProps.currentValue)
        const label = screen.getByText(childrenByElement)
        
        expect(field).toBeInTheDocument()
        expect(input).toHaveAttribute('value', testProps.currentValue)
        expect(input).toHaveAttribute('type', testProps.inputType)
        expect(input).toHaveAttribute('name', testProps.name)
        expect(label).toBeInTheDocument()

    })
})