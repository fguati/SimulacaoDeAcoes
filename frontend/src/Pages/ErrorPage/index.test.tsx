import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router-dom'
import unknownError from './useErrorHandler/unknownError'
import ErrorPage from '.'
import { useRouteError } from 'react-router-dom'

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

function getTitleAndMessage() {

    const title = screen.getByRole('title')
    const errorMessage = screen.getByRole('message')

    return {title, errorMessage}
}

describe('Test behavior of the error page', () => {
    test('Must render unknown error if has no available info', () => {
        renderErrorPage()
        const {title, errorMessage} = getTitleAndMessage()

        expect(title.textContent).toEqual(expect.stringContaining(unknownError.code!.toString()))
        expect(title.textContent).toEqual(expect.stringContaining(unknownError.name!))
        expect(errorMessage.textContent).toEqual(expect.stringContaining(unknownError.message!))

    })

    test('Must render the page using the information passed down by props', () => {
        const props: IErrorPageProps = {
            code: 333,
            name: 'Example error',
            message:'Test message of page not found'
        }

        renderErrorPage(props)
        const {title, errorMessage} = getTitleAndMessage()

        expect(title.textContent).toEqual(expect.stringContaining(props.code!.toString()))
        expect(title.textContent).toEqual(expect.stringContaining(props.name!))
        expect(errorMessage.textContent).toEqual(expect.stringContaining(props.message!))

    })

})