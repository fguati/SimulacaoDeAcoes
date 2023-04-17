/**
 * Function that receives the key of a cookie, check if the user has it,
 * and returns its value
 */
function getCookie(cookieKey: string) {
    //creates array with all user cookies
    const cookies = document.cookie.split(';')
    //looks for the requested cookie
    const reqCookie = cookies.find(cookie => cookie.includes(cookieKey))
    //check if the requested cookie exists
    if(reqCookie) {
        //splits the cookie value from its key
        const [key, value] = reqCookie.split('=')
        //makes sure the key retrieved is the one requested
        if(key === cookieKey) {
            return value
        }
    }

    return ''
}

export default getCookie
