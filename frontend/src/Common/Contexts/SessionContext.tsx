import { createContext, useState } from 'react'
import getCookie from './utils/getCookie'
import ReactChildren from 'Common/Types/ReactChildren'

interface Props {
    children: ReactChildren
}

interface ISessionContext {
    loggedIn: boolean
    setLogIn?: React.Dispatch<React.SetStateAction<boolean>>
    getLogInStatus?: () => boolean
}

let authCookie = getCookie('authToken')
const currentlyLoged = authCookie !== ''
const SessionContext = createContext<ISessionContext>({loggedIn: currentlyLoged})


const SessionProvider = ({ children }: Props) => {
    const [loggedIn, setLogIn] = useState(currentlyLoged)

    function getLogInStatus() {
        authCookie = getCookie('authToken')
        if(!authCookie){
            setLogIn(false)
        }
        return loggedIn
    }

    return (
        <SessionContext.Provider value={{loggedIn, setLogIn, getLogInStatus}}>
            {children}
        </SessionContext.Provider>
    )
}

export { SessionContext, SessionProvider}