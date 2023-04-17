import LoginPage from "Pages/Login";
import { Outlet } from "react-router-dom";
import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext, useEffect } from "react";

/**
 * Function that acts as middleware, checking whether user is already
 * logged in and, redirecting them to the login page if they are not
 */
function AuthRequestBranch() {
    //use the session context to check whether user is logged in
    const { getLogInStatus, loggedIn } = useContext(SessionContext)
    useEffect(() => {
        getLogInStatus!()
    }, [getLogInStatus, loggedIn])

    return(
        loggedIn ? <Outlet/> : <LoginPage/> 
    )
}

export default AuthRequestBranch