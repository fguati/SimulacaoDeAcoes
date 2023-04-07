import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext } from "react";
import useCookies from "react-cookie/cjs/useCookies";

function useLogOut() {
    const { setLogIn } = useContext(SessionContext)
    const [cookies, setCookie] = useCookies()

    return () => {
        const expiredDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
        setCookie('authToken', '', {expires: expiredDate})
        setLogIn!(false)
        console.log(cookies)
    }

}

export default useLogOut