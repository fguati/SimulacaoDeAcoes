import { createContext, useState } from 'react'
import getCookie from 'utils/getCookie'
import ReactChildren from 'Common/Types/ReactChildren'

interface Props {
    children: ReactChildren
}

interface ISessionContext {
    setLogIn?: React.Dispatch<React.SetStateAction<boolean>>
    getLogInStatus?: () => boolean
    loggedIn?: boolean
}

/**Session context will keep data relating to the session, 
 * receiving it initially from local storage sources 
*/
const SessionContext = createContext<ISessionContext>({})

/**
 * Session Provider will provide session data, initially
 * received from local storage, cookies, cache, etc.
 */
const SessionProvider = ({ children }: Props) => {
    /**create a state of logged in that determines 
     * if user is already logged in. Initial value
     * is determined by whether or not user has an
     * authToken cookie
    */
    let authCookie = getCookie('authToken')
    const currentlyLoged = authCookie !== ''
    const [loggedIn, setLogIn] = useState(currentlyLoged)

    /**
     * the log in status must be accessed only through
     * this function, because it first checks the cookies
     * for authTokens, making sure that, if the status of
     * the cookie changed, the loged in status will have 
     * changed as well
     */
    function getLogInStatus() {
        authCookie = getCookie('authToken')
        if(!authCookie){
            setLogIn(false)
        }
        return loggedIn
    }

    return (
        <SessionContext.Provider value={{setLogIn, getLogInStatus, loggedIn}}>
            {children}
        </SessionContext.Provider>
    )
}

export { SessionContext, SessionProvider}