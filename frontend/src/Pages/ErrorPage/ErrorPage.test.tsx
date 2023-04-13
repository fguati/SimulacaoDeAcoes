import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router-dom'
import unknownError from './useErrorHandler/unknownError'
import ErrorPage from '.'
import IErrorPageProps from './IErrorPageProps'
import { useLocation } from "react-router-dom";

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        ...originalModule,
        useLocation: jest.fn()
    }
})


function renderErrorPage(props?: IErrorPageProps) {
    const routerConfig:RouteObject[] = [
        {
            path:'/',
            element: <ErrorPage {...props}/>
        }
    ]
    
    const router = createMemoryRouter(routerConfig)

    return render(
        <RouterProvider router={router}/>
    )
}

function getTitleAndMessage(code:number | undefined, name:string | undefined, message:string | undefined) {

    const title = screen.getByText(`Error ${code}: ${name}`)
    const errorMessage = screen.getByText(`${message}`)

    return {title, errorMessage}
}

describe('Test behavior of the error page', () => {
    const mockedUseState = useLocation as jest.MockedFunction<typeof useLocation>

    beforeEach(() => {
        //@ts-ignore
        mockedUseState.mockReturnValue({
            state: undefined
        })
    })

    test('Must render unknown error if has no available info', () => {
        renderErrorPage()
        const {code, name, message} = unknownError
        const {title, errorMessage} = getTitleAndMessage(code, name, message)

        expect(title.textContent).toEqual(expect.stringContaining(code!.toString()))
        expect(title.textContent).toEqual(expect.stringContaining(name!))
        expect(errorMessage.textContent).toEqual(expect.stringContaining(message!))

    })

    test('Must render the page using the information passed down by props', () => {
        const props: IErrorPageProps = {
            code: 333,
            name: 'Example error',
            message:'Test message of page not found'
        }

        renderErrorPage(props)
        const {code, name, message} = props
        const {title, errorMessage} = getTitleAndMessage(code, name, message)

        expect(title.textContent).toEqual(expect.stringContaining(props.code!.toString()))
        expect(title.textContent).toEqual(expect.stringContaining(props.name!))
        expect(errorMessage.textContent).toEqual(expect.stringContaining(props.message!))

    })

    test('Must render error page using the information passed through navigation', () => {
        const mockedState: IErrorPageProps = {
            code: 333,
            name: 'Example error',
            message:'Test message of page not found'
        }

        //@ts-ignore
        mockedUseState.mockReturnValue({
            state: JSON.stringify(mockedState)
        })

        renderErrorPage()
        const {code, name, message} = mockedState
        const {title, errorMessage} = getTitleAndMessage(code, name, message)

        expect(title.textContent).toEqual(expect.stringContaining(mockedState.code!.toString()))
        expect(title.textContent).toEqual(expect.stringContaining(mockedState.name!))
        expect(errorMessage.textContent).toEqual(expect.stringContaining(mockedState.message!))
    })

})