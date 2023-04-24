import LoginPage from "../.."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'

import Form from "Components/Form";
import useSubmitLoginRequest from "../../utils/useSubmitLoginRequest";
jest.mock("../../utils/useSubmitLoginRequest", () => jest.fn())
jest.mock("Components/Form", () => jest.fn())

describe('unit tests: test login page render and behavior with mocked components and hooks', () => {
    
    const mockedForm = Form as jest.MockedFunction<typeof Form>
    const mockedUseSubmitLoginRequest = useSubmitLoginRequest as jest.MockedFunction<typeof useSubmitLoginRequest>
    const mockedSubmitLogin = jest.fn()

    beforeEach(() => {
        mockedForm.mockImplementation(({ fields, onSubmit }) => {
            return (<form>form</form>)
        })
    
        mockedUseSubmitLoginRequest.mockReturnValue(mockedSubmitLogin)

    })

    
    test('Page must render with the form component', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(screen.getByText('form')).toBeInTheDocument()

    })

    test('useSubmitLoginRequest hook must be called', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(mockedUseSubmitLoginRequest).toBeCalled()
    })

})