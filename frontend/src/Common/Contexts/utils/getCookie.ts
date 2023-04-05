function getCookie(cookieKey: string) {
    const cookies = document.cookie.split(';')
    const reqCookie = cookies.find(cookie => cookie.includes(cookieKey))
    if(reqCookie) {
        const keyValuePair = reqCookie.split('=')
        return keyValuePair[1]
    }

    return ''
}

export default getCookie
