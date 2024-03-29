import { SessionContext } from "Common/Contexts/SessionContext";
import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import IServerResponse from "Interfaces/IServerResponse";
import { useContext } from "react";

/**
 * Custom hook that returns a function that handles the responses of 
 * successful http requests to the /login route of the backend API.
 * This function had to be created as a hook that returns the actual
 * handler function since only hooks can invoke other hooks but hooks
 * cannot be used on the event handlers
 */
function useLoginSuccessHandler() {
    //get the setter function that allows us to change the user log in status
    const { setLogIn } = useContext(SessionContext)
    //get function that renders a snackbar
    const { activateSnackbar } = useContext(SnackbarContext)

    /**
     * handler function for succesful responses received from http requests.
     * It receives the success response only so it can interface with the useResponseHandler custom hook
     */
    async function loginSuccessHandler(response: IServerResponse<unknown>) {
        //set user login status to true, which is how the app knows the user is logged in. Obs: updates state functionally to avoid the stale closure problem
        setLogIn(status => true)
        
        //alerts the user that their login was successful
        activateSnackbar('Login successful', { colorPalette: 'success' })

    }

    return loginSuccessHandler
    
}

export default useLoginSuccessHandler