import LoginPage from "Pages/Login";
import { Outlet } from "react-router-dom";
import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext } from "react";

function AuthRequestBranch() {
    const { getLogInStatus } = useContext(SessionContext)
    const loggedIn = getLogInStatus!()

    return(
        loggedIn ? <Outlet/> : <LoginPage/> 
    )
}

export default AuthRequestBranch