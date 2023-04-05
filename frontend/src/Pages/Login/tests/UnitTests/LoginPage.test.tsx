import LoginPage from "../.."
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import '@testing-library/jest-dom'

import Form from "Components/Form";
import PageLayout from "Components/PageLayout";
import useSubmitLoginRequest from "../../utils/useSubmitLoginRequest";
jest.mock("../../utils/useSubmitLoginRequest", () => jest.fn())
jest.mock("Components/Form", () => jest.fn())
jest.mock("Components/PageLayout", () => jest.fn())

describe('unit tests: test login page render and behavior with mocked components and hooks', () => {
    
    const mockedForm = Form as jest.MockedFunction<typeof Form>
    const mockedPageLayout = PageLayout as jest.MockedFunction<typeof PageLayout>
    const mockedUseSubmitLoginRequest = useSubmitLoginRequest as jest.MockedFunction<typeof useSubmitLoginRequest>
    const mockedSubmitLogin = jest.fn()

    beforeEach(() => {
        mockedForm.mockImplementation(({ fields, onSubmit }) => {
            return (<form>form</form>)
        })
    
        mockedPageLayout.mockImplementation(({children}) => {
            return (
                <div data-testid='PageLayout'>
                    {children}
                </div>
            )
        })
        mockedUseSubmitLoginRequest.mockReturnValue(mockedSubmitLogin)

    })

    
    test('Page must render with the page layout and form components', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(screen.getByText('form')).toBeInTheDocument()
        expect(screen.getByTestId('PageLayout')).toBeInTheDocument()

    })

    test('useSubmitLoginRequest hook must be calles', () => {
        render(<LoginPage/>, {wrapper:MemoryRouter})

        expect(mockedUseSubmitLoginRequest).toBeCalled()
    })

})