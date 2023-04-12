import { useContext } from 'react';
import useCookies from "react-cookie/cjs/useCookies";
import useLogOut from 'utils/logOut';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react', () => {
    const React = jest.requireActual('react')

    return {
        ...React,
        useContext: jest.fn()
    }
})

jest.mock('react-cookie/cjs/useCookies', () => {
    return jest.fn()
})

describe('Tests of the log out custom hook', () => {
    const mockedUseContext = useContext as jest.MockedFunction<typeof useContext>
    const mockedSetLogin = jest.fn()
    const mockedUseCookies = useCookies as jest.MockedFunction<typeof useCookies>
    const mockedSetCookies = jest.fn()

    beforeEach(() => {
        mockedUseContext.mockReturnValue({
            setLogIn: mockedSetLogin
        })

        mockedSetCookies.mockImplementation((name: string, value: any) => {})
        // @ts-ignore
        mockedUseCookies.mockReturnValue([
            '',
            mockedSetCookies
        ])
    })


    it('must call setCookie function with authToken and an expired date', () => {
        const expiredDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
        const { result } = renderHook(() => useLogOut())
        result.current()
        expect(mockedSetCookies).toBeCalledWith('authToken', '', {expires: expiredDate})
    })
    
    it('must call the setLogin function with false', () => {
        const { result } = renderHook(() => useLogOut())
        result.current()
        expect(mockedSetLogin).toBeCalledWith(false)
    })
})