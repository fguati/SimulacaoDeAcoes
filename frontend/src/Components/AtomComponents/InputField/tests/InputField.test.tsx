import { fireEvent, render, screen } from "@testing-library/react"
import InputField from ".."
import IInputFieldProps from "../IInputFieldProps"
import '@testing-library/jest-dom'
import useValidateField from "../Functionality/useValidateField";

jest.mock("../Functionality/useValidateField", () => jest.fn())

describe('testing the Input Field Component', () => {
    
    const testProps: IInputFieldProps = {
        currentValue: 'testValue',
        name: 'testName',
        setValue: jest.fn(),
        inputType:"text",
        children: 'exampleChildAttribute',
        validators: [jest.fn(), jest.fn()]
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

    it('On blur of the input, must call the validation function with the provided validators and current value', () => {
        const mockedValidateField = jest.fn();
        (useValidateField as jest.Mock).mockReturnValue(mockedValidateField);
        const {name, currentValue, validators} = testProps
        
        render(
            <InputField {...testProps}>
                {childrenByElement}
            </InputField>
        );
    
        const inputField = screen.getByRole("textbox");
        fireEvent.blur(inputField);
    
        expect(mockedValidateField).toHaveBeenCalledTimes(1);
        expect(mockedValidateField).toHaveBeenCalledWith(name, currentValue, validators);
    });
})