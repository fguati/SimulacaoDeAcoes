import getCookie from "utils/getCookie"

describe('Tests for the getCookie function', () => {
    
    it('returns the value of the looked up cookie, if it exists', () => {
        const exampleCookie = 'authToken'
        const exampleValue = '1234'

        document.cookie = `${exampleCookie}=${exampleValue}`
        document.cookie = `cookieNotLookedFor=unrequiredValue`

        const result = getCookie(exampleCookie)
        expect(result).toEqual(exampleValue)
    })

    it('returns an empty string if the looked up cookie does not exist', () => {
        document.cookie = ''
        expect(getCookie('inexistentCookie')).toEqual('')
    })
})