import { createContext, useState } from 'react'
import getCookie from 'utils/getCookie'
import ReactChildren from 'Common/Types/ReactChildren'

interface Props {
    children: ReactChildren
}

interface ISessionContext {
    setLogIn?: React.Dispatch<React.SetStateAction<boolean>>
    getLogInStatus?: () => boolean
}

const SessionContext = createContext<ISessionContext>({})


const SessionProvider = ({ children }: Props) => {
    let authCookie = getCookie('authToken')
    const currentlyLoged = authCookie !== ''
    const [loggedIn, setLogIn] = useState(currentlyLoged)

    function getLogInStatus() {
        authCookie = getCookie('authToken')
        if(!authCookie){
            setLogIn(false)
        }
        return loggedIn
    }

    return (
        <SessionContext.Provider value={{setLogIn, getLogInStatus}}>
            {children}
        </SessionContext.Provider>
    )
}

export { SessionContext, SessionProvider}