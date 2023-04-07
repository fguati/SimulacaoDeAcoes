import StyledLink from "Components/AtomComponents/StyledLink"
import useLogOut from "utils/logOut";
import HeaderContainer from "./HeaderContainer"
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "Common/Contexts/SessionContext";

function Header() {
    const { getLogInStatus } = useContext(SessionContext)
    const loggedIn = getLogInStatus!()
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