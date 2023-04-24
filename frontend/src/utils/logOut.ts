import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext } from "react";
import useCookies from "react-cookie/cjs/useCookies";

/**
 * Function that logs the user out. 
 */
function useLogOut() {
    //get functions to manipulate the cookies and the user login status
    const { setLogIn } = useContext(SessionContext)
    const [, setCookie] = useCookies()

    return () => {
        //first date of the js date object - will always be expired
        const expiredDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
        /**sets the expiration date of the authToken to a date already passed so 
         * cookie is erased - effectively logging user out for the purpuses of 
         * communicating with backend
        */
        setCookie('authToken', '', {expires: expiredDate})
        //set user login status to logged out
        setLogIn(false)
    }

}

export default useLogOut