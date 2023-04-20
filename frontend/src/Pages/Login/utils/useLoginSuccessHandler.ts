import { SessionContext } from "Common/Contexts/SessionContext";
import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import { useContext } from "react";
import { NavigateFunction, useLocation } from "react-router-dom";

/**
 * Custom hook that returns a function that handles the responses of 
 * successful http requests to the /login route of the backend API.
 * This function had to be created as a hook that returns the actual
 * handler function since only hooks can invoke other hooks but hooks
 * cannot be used on the event handlers
 */
function useLoginSuccessHandler() {
    //get the location object from the useLocation hook
    const location = useLocation()
    //get the setter function that allows us to change the user log in status
    const { setLogIn } = useContext(SessionContext)
    //get function that renders a snackbar
    const { activateSnackbar } = useContext(SnackbarContext)

    /**
     * handler function for succesful responses received from http requests.
     * It receives the success response only so it can interface with the useResponseHandler custom hook
     */
    function loginSuccessHandler(response: Response, navigation: NavigateFunction) {
        //alerts the user that their login was successful
        activateSnackbar('Login successful', { colorPalette: 'success' })
        alert('Login feito com suscesso')

        //set user login status to true, which is used by other parts of the app through the session context
        setLogIn!(true)

        //if user was accessing the login page directly, they are redirected to their homepage
        if(location.pathname === '/login') {
            return navigation('/')
        }

        //redirects the user to the route were trying to access before logging in
        return navigation(0)
    }

    return loginSuccessHandler
    
}

export default useLoginSuccessHandler