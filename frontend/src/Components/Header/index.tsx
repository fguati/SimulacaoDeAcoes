import StyledLink from "Components/AtomComponents/StyledLink"
import useLogOut from "utils/logOut";
import HeaderContainer from "./HeaderContainer"
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "Common/Contexts/SessionContext";

/**Header component, that has the login and signup links when the user 
 * is logged out and the log out link when the user is logged in
*/
function Header() {
    /**acquire the getter function for the login status from the session context
     * and use it to check whether the user is logged in or not
    */
    const { getLogInStatus } = useContext(SessionContext)
    const loggedIn = getLogInStatus!()

    //receives the logout function through the useLogOut custom hook
    const logOut = useLogOut()

    return (
        <>
            <HeaderContainer>
                <StyledLink to='/'>Home</StyledLink>

                {!loggedIn && <nav>
                    <StyledLink to='/login'>Login</StyledLink>
                    <StyledLink to='/signup'>Sign Up</StyledLink>
                </nav>}

                {loggedIn && <StyledLink to='/login' onClick={() => logOut()}>Log Out</StyledLink>}
            </HeaderContainer>
            
            <Outlet/>
        </>
    )
}

export default Header;