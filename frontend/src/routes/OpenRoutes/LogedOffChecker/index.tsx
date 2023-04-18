import { SessionContext } from "Common/Contexts/SessionContext"
import { useContext } from "react"
import { Navigate, Outlet,  } from "react-router-dom"


function LoggedOffBranch() {
    const { loggedIn } = useContext(SessionContext)
    
    return (
        !loggedIn ? <Outlet/> : <Navigate to={'/'}/>
    )
}

export default LoggedOffBranch