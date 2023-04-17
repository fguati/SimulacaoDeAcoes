import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LastPageButton from '.'
import { useNavigate } from 'react-router-dom'

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        __esModule: true,
        ...originalModule,
        useNavigate: jest.fn()
    }
})

describe('Test behavior of return button', () => {
    const mockedNavigationHook = useNavigate as jest.MockedFunction<typeof useNavigate>
    
    test('Clicking the button should call navigation hook with a -1 argument', () => {
        const mockedNavigation = jest.fn()
        mockedNavigationHook.mockReturnValue(mockedNavigation)

        render(<LastPageButton/>)

        const $button = screen.getByText('return', { exact: false})
        fireEvent.click($button)

        expect(mockedNavigation).toBeCalledWith(-1)
    })
})