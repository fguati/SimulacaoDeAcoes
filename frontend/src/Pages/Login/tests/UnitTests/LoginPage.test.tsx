import LoginPage from "../.."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'

import Form from "Components/Form";
import useSubmitForm from "utils/BackendAPICommunication/useSubmitForm";
jest.mock("utils/BackendAPICommunication/useSubmitForm", () => jest.fn())
jest.mock("Components/Form", () => jest.fn())

describe('unit tests: test login page render and behavior with mocked components and hooks', () => {
    
    const mockedForm = Form as jest.MockedFunction<typeof Form>
    const mockedUseSubmitForm = useSubmitForm as jest.MockedFunction<typeof useSubmitForm>
    const mockedSubmitLogin = jest.fn()

    beforeEach(() => {
        mockedForm.mockImplementation(({ fields, onSubmit }) => {
            return (<form>form</form>)
        })
    
        mockedUseSubmitForm.mockReturnValue(mockedSubmitLogin)

    })

    
    test('Page must render with the form component', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(screen.getByText('form')).toBeInTheDocument()

    })

    test('useSubmitLoginRequest hook must be called', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(mockedUseSubmitForm).toBeCalled()
    })

})