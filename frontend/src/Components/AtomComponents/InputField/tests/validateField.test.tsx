import { outScrnSnckBrPosition } from "Common/Constants"
import { ISnackbarContext, SnackbarContext } from "Common/Contexts/SnackbarContext"
import useValidateField from "../Functionality/useValidateField"
import { FormValidator } from "utils/FormValidators"
import { fireEvent, render, screen } from "@testing-library/react"

describe('Tests the function that validates fields', () => {
    interface IMockField {
        name: string
        value: string
        validators: FormValidator[]
    }
    
    const mockedActivateSnackbar = jest.fn() 

    const mockedSnackbarContext: ISnackbarContext = {
        active: false, 
        deactivateSnackbar: jest.fn(),
        activateSnackbar: mockedActivateSnackbar,
        snackBarPosition: outScrnSnckBrPosition, 
        colorPalette: 'neutral',
        snackbarMessage: 'Mocked message',
        overwriteDeactivationTimer: jest.fn()
    }

    const testValidatorFailed: FormValidator = (field) => {
        return {valid: false}
    }
    const testValidatorApproved: FormValidator = (field) => {
        return {valid: true}
    }

    const testFormField: IMockField = {
        name: 'Test Field',
        value: 'test value 1',
        validators: []
    }
    
    const TestComponent = () => {
        const validatorFunction = useValidateField()
        const { name, value, validators } = testFormField
        
        return(
            <button onClick={() => validatorFunction(name, value, validators)}>Test Button</button>
        )
    }

    test('if field has one failed validator, should call activate snackbar with failed theme', () => {
        testFormField.validators = [testValidatorFailed, testValidatorApproved]
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <TestComponent/>
            </SnackbarContext.Provider>
        )
        const $button = screen.getByText('Test Button')
        fireEvent.click($button)
        expect(mockedActivateSnackbar).toBeCalledWith(expect.any(String), expect.objectContaining({
            colorPalette: 'failure'
        }))
    })

    test('if field has all failed validators, should call activate snackbar with failed theme', () => {
        testFormField.validators = [testValidatorFailed, testValidatorFailed]
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <TestComponent/>
            </SnackbarContext.Provider>
        )
        const $button = screen.getByText('Test Button')
        fireEvent.click($button)
        expect(mockedActivateSnackbar).toBeCalledWith(expect.any(String), expect.objectContaining({
            colorPalette: 'failure'
        }))
    })

    test('if field no failed validators, shouldnt call activate snackbar', () => {
        testFormField.validators = [testValidatorApproved, testValidatorApproved]
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <TestComponent/>
            </SnackbarContext.Provider>
        )
        const $button = screen.getByText('Test Button')
        fireEvent.click($button)
        expect(mockedActivateSnackbar).not.toBeCalled()
    })

    test('if field no validators, shouldnt call activate snackbar', () => {
        testFormField.validators = []
        render(
            <SnackbarContext.Provider value={mockedSnackbarContext}>
                <TestComponent/>
            </SnackbarContext.Provider>
        )
        const $button = screen.getByText('Test Button')
        fireEvent.click($button)
        expect(mockedActivateSnackbar).not.toBeCalled()
    })
})