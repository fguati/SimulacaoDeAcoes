import useCookies from "react-cookie/cjs/useCookies";

function useLogOut() {
    const [cookies, setCookie] = useCookies()

    return () => {
        const expiredDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
        setCookie('authToken', '', {expires: expiredDate})
        console.log(cookies)
    }

}

export default useLogOut