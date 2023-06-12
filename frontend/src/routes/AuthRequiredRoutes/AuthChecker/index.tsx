/* eslint-disable react-hooks/exhaustive-deps */
import LoginPage from "Pages/Login";
import { Outlet } from "react-router-dom";
import { SessionContext } from "Common/Contexts/SessionContext";
import { useContext, useEffect } from "react";
import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import { UserAssetProvider } from "Common/Contexts/UserBalanceContext";

/**
 * Function that acts as middleware, checking whether user is already
 * logged in and, redirecting them to the login page if they are not
 */
function AuthRequestBranch() {
    const { checkAuthCookie, loggedIn } = useContext(SessionContext)
    const { activateSnackbar } = useContext(SnackbarContext)
    const errorMessage = 'Please log in before trying to access this page'
    
    useEffect(() => {
        //use the session context to check whether user is logged in
        checkAuthCookie()
    }, [checkAuthCookie])

    useEffect(() => {
        if(!loggedIn) {
            //renders error snackbar in case it is not logged in
            activateSnackbar(errorMessage, { colorPalette: 'failure'})
        }
    }, [])
    
    return(
        loggedIn ? 
            <UserAssetProvider>
                <Outlet/>
            </UserAssetProvider> : 
            <LoginPage/> 
    )
}

export default AuthRequestBranch