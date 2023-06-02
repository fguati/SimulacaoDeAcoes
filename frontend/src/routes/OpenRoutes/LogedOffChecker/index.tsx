import { SessionContext } from "Common/Contexts/SessionContext"
import { useContext, useEffect } from "react"
import { Navigate, Outlet,  } from "react-router-dom"


function LoggedOffBranch() {
    const { loggedIn, checkAuthCookie } = useContext(SessionContext)
    
    useEffect(() => {
        //use the session context to check whether user is logged in
        checkAuthCookie()
    }, [checkAuthCookie])

    return (
        !loggedIn ? <Outlet/> : <Navigate to={'/'}/>
    )
}

export default LoggedOffBranch