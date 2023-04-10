import useLoginSuccessHandler from "../../utils/useLoginSuccessHandler"
import { renderHook } from '@testing-library/react-hooks';
import { NavigateFunction, useLocation, Location } from "react-router-dom";
import { useContext } from 'react';

jest.mock('react', () => {
	const React = jest.requireActual('react');
    return {
    	...React,
		useContext: jest.fn((context) => {
			return ({
				setLogIn: jest.fn()
			})
		})
        
	}
})

jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");

    return {
        __esModule: true,
        ...originalModule,
        useLocation: jest.fn()
    }
})


describe('unit tests of the useLoginSuccessHandler custom hook', () => {
    const mockNavigation = jest.fn() as NavigateFunction
    const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>
    const mockResponse = {} as Response
	const mockedUseContext = useContext as jest.MockedFunction<typeof useContext>

    beforeEach(() => {
        mockedUseContext.mockReturnValue({
            setLogIn: jest.fn()
        })
    })

    test('rendered function must call the mockNavigation function with the route "/" if location.pathname return value if "/login"', () => {
        const mockLocation: Location = {
            pathname: '/login',
            hash: '',
            key: '',
            search: '',
            state: ''
        };

        mockUseLocation.mockReturnValue(mockLocation)

        const { result } = renderHook(() => useLoginSuccessHandler())
        result.current(mockResponse, mockNavigation)

        expect(mockNavigation).toBeCalledWith('/')
    })

    test('rendered function must call the mockNavigation function with "0" when location.pathname return value diferent of "/login"', () => {
        const mockLocation: Location = {
            pathname: '/',
            hash: '',
            key: '',
            search: '',
            state: ''
        };

        mockUseLocation.mockReturnValue(mockLocation)

        const { result } = renderHook(() => useLoginSuccessHandler())
        result.current(mockResponse, mockNavigation)

        expect(mockNavigation).toBeCalledWith(0)
    })

})